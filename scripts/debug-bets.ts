import 'dotenv/config';
import { db } from '../src/db';
import { bets, betItems, markets, marketOptions } from '../src/db/schema';
import { eq, desc } from 'drizzle-orm';

async function debugBets() {
    const userId = '8dccba02-40fb-4dc0-b9ac-1663b82251e6'; // From error
    console.log(`Fetching bets for user: ${userId}`);

    try {
        const userBets = await db.select({
            id: bets.id,
            stake: bets.stakeCents,
            payout: bets.potentialPayoutCents,
            status: bets.status,
            createdAt: bets.createdAt,
            marketTitle: markets.title,
            optionLabel: marketOptions.label
        })
            .from(bets)
            .leftJoin(betItems, eq(bets.id, betItems.betId))
            .leftJoin(markets, eq(betItems.marketId, markets.id))
            .leftJoin(marketOptions, eq(betItems.marketOptionId, marketOptions.id))
            .where(eq(bets.userId, userId))
            .orderBy(desc(bets.createdAt));

        console.log('Bets found:', userBets);
    } catch (error) {
        console.error('Error fetching bets:', error);
    }
    process.exit(0);
}

debugBets();
