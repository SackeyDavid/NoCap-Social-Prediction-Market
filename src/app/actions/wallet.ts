'use server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { wallets, transactions } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { creditWallet, createWalletForUser } from '@/lib/wallet'
import { revalidatePath } from 'next/cache'

// Retry helper for database operations
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      console.error(`DB operation failed (attempt ${i + 1}/${retries}):`, error.message);
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
}

export async function getUserWallet() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  try {
    let wallet = await withRetry(() =>
      db.query.wallets.findFirst({
        where: eq(wallets.userId, user.id),
      })
    );

    if (!wallet) {
      // Auto create
      wallet = await withRetry(() => createWalletForUser(user.id, user.email));
    }

    return wallet;
  } catch (error) {
    console.error('Failed to get wallet after retries:', error);
    // Return a mock wallet to prevent UI breaking
    return {
      id: 'temp',
      userId: user.id,
      balanceCents: 0,
      currency: 'GHS',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function getTransactionHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  try {
    return await withRetry(() =>
      db.query.transactions.findMany({
        where: eq(transactions.userId, user.id),
        orderBy: [desc(transactions.createdAt)],
        limit: 50
      })
    );
  } catch (error) {
    console.error('Failed to get transactions after retries:', error);
    return [];
  }
}

export async function topUpDemo(formData?: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await withRetry(() => creditWallet(user.id, 2000, { type: 'deposit', method: 'demo_topup' }));
  revalidatePath('/wallet')
}
