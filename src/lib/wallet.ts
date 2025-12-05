import { db } from '@/db';
import { wallets, transactions, transactionTypeEnum } from '@/db/schema';
import { eq } from 'drizzle-orm';

import { users } from '@/db/schema';

export async function createWalletForUser(userId: string, email?: string) {
  // Ensure user exists in public table (sync with auth)
  if (email) {
    await db.insert(users).values({
      id: userId,
      email: email,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: users.id,
      set: { email: email, updatedAt: new Date() }
    });
  }

  // Check if wallet exists
  const existing = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });
  if (existing) return existing;

  const [newWallet] = await db.insert(wallets).values({ userId }).returning();
  return newWallet;
}

export async function getWallet(userId: string) {
  const wallet = await db.query.wallets.findFirst({
    where: eq(wallets.userId, userId),
  });
  return wallet;
}

export async function creditWallet(userId: string, amountCents: number, meta: any = {}) {
  return await db.transaction(async (tx) => {
    let wallet = await tx.query.wallets.findFirst({
      where: eq(wallets.userId, userId),
    });

    if (!wallet) {
      // Create if not exists (fallback)
      [wallet] = await tx.insert(wallets).values({ userId }).returning();
    }

    const newBalance = wallet.balanceCents + amountCents;

    await tx.update(wallets)
      .set({ balanceCents: newBalance, updatedAt: new Date() })
      .where(eq(wallets.id, wallet.id));

    await tx.insert(transactions).values({
      userId,
      type: meta.type || 'deposit',
      amountCents: amountCents,
      balanceAfterCents: newBalance,
      meta,
    });

    return newBalance;
  });
}

export async function debitWallet(userId: string, amountCents: number, meta: any = {}) {
  return await db.transaction(async (tx) => {
    const wallet = await tx.query.wallets.findFirst({
      where: eq(wallets.userId, userId),
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    if (wallet.balanceCents < amountCents) {
      throw new Error('Insufficient funds');
    }

    const newBalance = wallet.balanceCents - amountCents;

    await tx.update(wallets)
      .set({ balanceCents: newBalance, updatedAt: new Date() })
      .where(eq(wallets.id, wallet.id));

    await tx.insert(transactions).values({
      userId,
      type: meta.type || 'withdrawal',
      amountCents: -amountCents,
      balanceAfterCents: newBalance,
      meta,
    });

    return newBalance;
  });
}


