'use server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { wallets, transactions } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { creditWallet, createWalletForUser } from '@/lib/wallet'
import { revalidatePath } from 'next/cache'

export async function getUserWallet() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  let wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, user.id),
  })

  if (!wallet) {
    // Auto create
    wallet = await createWalletForUser(user.id, user.email);
  }

  return wallet
}

export async function getTransactionHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  return await db.query.transactions.findMany({
    where: eq(transactions.userId, user.id),
    orderBy: [desc(transactions.createdAt)],
    limit: 50
  })
}

export async function topUpDemo(formData?: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await creditWallet(user.id, 2000, { type: 'deposit', method: 'demo_topup' }) // 20 GHS
  revalidatePath('/wallet')
}
