'use server'

import { db } from '@/db'
import { markets, marketOptions, bets, betItems, wallets, transactions } from '@/db/schema'
import { eq, and, lt } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type ResolutionOutcome = 'yes' | 'no' | 'void'

/**
 * Resolve a market - determines winners and pays out
 */
export async function resolveMarket(marketId: string, outcome: ResolutionOutcome) {
    // Get market with options
    const market = await db.query.markets.findFirst({
        where: eq(markets.id, marketId),
        with: { options: true }
    })

    if (!market) {
        return { success: false, error: 'Market not found' }
    }

    if (market.status === 'settled') {
        return { success: false, error: 'Market already resolved' }
    }

    // Find winning option
    const winningOption = market.options.find(o =>
        o.label.toLowerCase() === outcome.toLowerCase()
    )

    if (!winningOption && outcome !== 'void') {
        return { success: false, error: 'Invalid outcome' }
    }

    // Get all betItems for this market, with their parent bets
    const marketBetItems = await db.query.betItems.findMany({
        where: eq(betItems.marketId, marketId),
        with: {
            bet: true,
            marketOption: true
        }
    })

    // Process payouts
    let winnerCount = 0
    let totalPayout = 0

    for (const item of marketBetItems) {
        const bet = item.bet
        if (!bet) continue

        if (outcome === 'void') {
            // Refund the bet
            await creditUserWallet(bet.userId, bet.stakeCents, {
                type: 'refund',
                description: `Refund for voided market: ${market.title}`,
                marketId
            })

            // Update bet status to void
            await db.update(bets)
                .set({ status: 'void' })
                .where(eq(bets.id, bet.id))

        } else if (item.marketOptionId === winningOption?.id) {
            // Winner! Pay out potential payout
            const payout = bet.potentialPayoutCents

            await creditUserWallet(bet.userId, payout, {
                type: 'win',
                description: `Won bet: ${market.title}`,
                marketId
            })

            // Update bet status to won
            await db.update(bets)
                .set({ status: 'won' })
                .where(eq(bets.id, bet.id))

            winnerCount++
            totalPayout += payout
        } else {
            // Loser - update status
            await db.update(bets)
                .set({ status: 'lost' })
                .where(eq(bets.id, bet.id))
        }
    }

    // Update market status to settled
    await db.update(markets)
        .set({ status: 'settled' })
        .where(eq(markets.id, marketId))

    revalidatePath('/')
    revalidatePath(`/markets/${market.slug}`)

    return {
        success: true,
        outcome,
        winnerCount,
        totalPayout: totalPayout / 100, // Return in currency units
        totalBets: marketBetItems.length
    }
}

/**
 * Get markets that need resolution (closed but not settled)
 */
export async function getMarketsNeedingResolution() {
    const now = new Date()

    const allMarkets = await db.query.markets.findMany({
        where: eq(markets.status, 'open'),
        with: { options: true },
        orderBy: (markets, { asc }) => [asc(markets.closesAt)]
    })

    // Filter to only closed markets (closesAt < now)
    return allMarkets.filter(m => new Date(m.closesAt) < now)
}

/**
 * Credit a user's wallet
 */
async function creditUserWallet(
    userId: string,
    amountCents: number,
    meta: { type: string; description: string; marketId: string }
) {
    // Get wallet
    let wallet = await db.query.wallets.findFirst({
        where: eq(wallets.userId, userId)
    })

    if (!wallet) {
        // Create wallet if not exists
        const [newWallet] = await db.insert(wallets).values({
            userId,
            balanceCents: 0,
            currency: 'GHS'
        }).returning()
        wallet = newWallet
    }

    const newBalance = wallet.balanceCents + amountCents

    // Update balance
    await db.update(wallets)
        .set({
            balanceCents: newBalance,
            updatedAt: new Date()
        })
        .where(eq(wallets.id, wallet.id))

    // Record transaction
    await db.insert(transactions).values({
        userId,
        type: meta.type === 'win' ? 'bet_won' : 'adjustment',
        amountCents,
        balanceAfterCents: newBalance,
        meta: { marketId: meta.marketId, description: meta.description }
    })
}

/**
 * Get user's betting history with outcomes
 */
export async function getUserBetHistory(userId: string) {
    const userBets = await db.query.bets.findMany({
        where: eq(bets.userId, userId),
        orderBy: (bets, { desc }) => [desc(bets.createdAt)]
    })

    const enrichedBets = await Promise.all(userBets.map(async (bet) => {
        const item = await db.query.betItems.findFirst({
            where: eq(betItems.betId, bet.id),
            with: {
                market: true,
                marketOption: true
            }
        })

        return {
            id: bet.id,
            marketTitle: item?.market?.title || 'Unknown',
            marketSlug: item?.market?.slug || '',
            option: item?.marketOption?.label || 'Unknown',
            stake: bet.stakeCents / 100,
            potentialPayout: bet.potentialPayoutCents / 100,
            status: bet.status,
            createdAt: bet.createdAt,
            marketStatus: item?.market?.status || 'unknown'
        }
    }))

    return enrichedBets
}
