'use server'

import { createClient } from '@/lib/supabase/server'
import { debitWallet } from '@/lib/wallet'
import { db } from '@/db'
import { bets, betItems, marketOptions, markets } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function placeBet(marketId: string, optionId: string, stakeCents: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  try {
    // 1. Debit Wallet
    await debitWallet(user.id, stakeCents, { type: 'bet_placed', marketId })

    // 2. Calculate Potential Payout (Fixed odds 2.0 for MVP Yes/No unless specified)
    // For now, let's assume 1.9x (house edge)
    const multiplier = 1.9;
    const potentialPayout = Math.floor(stakeCents * multiplier);

    // 3. Create Bet
    const [bet] = await db.insert(bets).values({
      userId: user.id,
      stakeCents,
      potentialPayoutCents: potentialPayout,
      status: 'pending'
    }).returning();

    // 4. Create Bet Item
    await db.insert(betItems).values({
      betId: bet.id,
      marketId,
      marketOptionId: optionId,
      oddsMultiplier: multiplier.toString(),
    });

    return { success: true, betId: bet.id };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message };
  }
}

export async function getMyBets() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // 1. Fetch bets
  const userBets = await db.query.bets.findMany({
    where: eq(bets.userId, user.id),
    orderBy: [desc(bets.createdAt)],
    with: {
      // Drizzle's 'with' syntax is cleaner but if it uses joins under the hood that fail, we might need manual
      // Let's try manual fetching to be safe against pooler issues
    }
  });

  if (userBets.length === 0) return [];

  // 2. Fetch related details manually to avoid complex joins crashing the pooler
  const enrichedBets = await Promise.all(userBets.map(async (bet) => {
    // Get bet item to find market/option
    const betItem = await db.query.betItems.findFirst({
      where: eq(betItems.betId, bet.id),
      with: {
        market: true,
        marketOption: true
      }
    });

    return {
      id: bet.id,
      stake: bet.stakeCents,
      payout: bet.potentialPayoutCents,
      status: bet.status,
      createdAt: bet.createdAt,
      marketTitle: betItem?.market?.title || 'Unknown Market',
      optionLabel: betItem?.marketOption?.label || 'Unknown Option'
    };
  }));

  return enrichedBets;
}

