'use server'

import { db } from '@/db'
import { comments, users } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'

export interface Comment {
    id: string;
    message: string;
    createdAt: Date;
    user: {
        displayName: string | null;
        email: string;
        avatarUrl: string | null;
    };
}

export async function getComments(marketId: string): Promise<Comment[]> {
    try {
        const result = await db
            .select({
                id: comments.id,
                message: comments.message,
                createdAt: comments.createdAt,
                userDisplayName: users.displayName,
                userEmail: users.email,
                userAvatarUrl: users.avatarUrl,
            })
            .from(comments)
            .innerJoin(users, eq(comments.userId, users.id))
            .where(eq(comments.marketId, marketId))
            .orderBy(desc(comments.createdAt))
            .limit(50);

        return result.map(r => ({
            id: r.id,
            message: r.message,
            createdAt: r.createdAt,
            user: {
                displayName: r.userDisplayName,
                email: r.userEmail,
                avatarUrl: r.userAvatarUrl,
            },
        }));
    } catch (error) {
        console.error('Failed to get comments:', error);
        return [];
    }
}

export async function addComment(marketId: string, message: string): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get user ID from our users table
        const dbUser = await db.query.users.findFirst({
            where: eq(users.email, user.email!),
        });

        if (!dbUser) {
            return { success: false, error: 'User not found' };
        }

        // Insert comment
        await db.insert(comments).values({
            userId: dbUser.id,
            marketId,
            message: message.trim(),
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to add comment:', error);
        return { success: false, error: 'Failed to add comment' };
    }
}
