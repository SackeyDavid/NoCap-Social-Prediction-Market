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

  const userBets = await db.select({
      id: bets.id,
      stake: bets.stakeCents,
      payout: bets.potentialPayoutCents,
      status: bets.status,
      createdAt: bets.createdAt,
      marketTitle: markets.title, // simple join
      optionLabel: marketOptions.label
  })
  .from(bets)
  .leftJoin(betItems, eq(bets.id, betItems.betId))
  .leftJoin(markets, eq(betItems.marketId, markets.id))
  .leftJoin(marketOptions, eq(betItems.marketOptionId, marketOptions.id))
  .where(eq(bets.userId, user.id))
  .orderBy(desc(bets.createdAt));
  
  return userBets;
}

