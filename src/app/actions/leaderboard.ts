'use server'

import { db } from '@/db'
import { users, wallets } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function getLeaderboard() {
    try {
        // Join wallets and users, sort by balance
        const leaderboard = await db.select({
            userId: users.id,
            displayName: users.displayName,
            email: users.email,
            avatarUrl: users.avatarUrl,
            balanceCents: wallets.balanceCents,
        })
            .from(wallets)
            .leftJoin(users, eq(wallets.userId, users.id))
            .orderBy(desc(wallets.balanceCents))
            .limit(50);

        return leaderboard;
    } catch (e) {
        console.error('Failed to fetch leaderboard:', e);
        return [];
    }
}
