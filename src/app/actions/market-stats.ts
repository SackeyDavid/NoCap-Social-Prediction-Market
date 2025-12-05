'use server'

import { db } from '@/db'
import { bets, betItems, marketOptions, comments } from '@/db/schema'
import { eq, sql, and } from 'drizzle-orm'

export interface MarketStats {
    totalVolumeCents: number;
    yesPercentage: number;
    noPercentage: number;
    totalBets: number;
    averageStakeCents: number;
    biggestBetCents: number;
    commentCount: number;
}

export async function getMarketStats(marketId: string): Promise<MarketStats> {
    try {
        // Get all bet items for this market with their bets
        const betItemsData = await db
            .select({
                stakeCents: bets.stakeCents,
                optionLabel: marketOptions.label,
            })
            .from(betItems)
            .innerJoin(bets, eq(betItems.betId, bets.id))
            .innerJoin(marketOptions, eq(betItems.marketOptionId, marketOptions.id))
            .where(eq(betItems.marketId, marketId));

        // Get comment count
        const commentCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(comments)
            .where(eq(comments.marketId, marketId));

        const commentCount = Number(commentCountResult[0]?.count || 0);

        if (betItemsData.length === 0) {
            return {
                totalVolumeCents: 0,
                yesPercentage: 50,
                noPercentage: 50,
                totalBets: 0,
                averageStakeCents: 0,
                biggestBetCents: 0,
                commentCount,
            };
        }

        // Calculate stats
        let totalVolume = 0;
        let yesVolume = 0;
        let noVolume = 0;
        let biggestBet = 0;

        for (const item of betItemsData) {
            const stake = item.stakeCents;
            totalVolume += stake;

            if (item.optionLabel.toLowerCase().includes('yes')) {
                yesVolume += stake;
            } else {
                noVolume += stake;
            }

            if (stake > biggestBet) {
                biggestBet = stake;
            }
        }

        const totalBets = betItemsData.length;
        const averageStake = Math.round(totalVolume / totalBets);

        // Calculate percentages based on volume
        const yesPercentage = totalVolume > 0
            ? Math.round((yesVolume / totalVolume) * 100)
            : 50;
        const noPercentage = 100 - yesPercentage;

        return {
            totalVolumeCents: totalVolume,
            yesPercentage,
            noPercentage,
            totalBets,
            averageStakeCents: averageStake,
            biggestBetCents: biggestBet,
            commentCount,
        };
    } catch (error) {
        console.error('Failed to get market stats:', error);
        return {
            totalVolumeCents: 0,
            yesPercentage: 50,
            noPercentage: 50,
            totalBets: 0,
            averageStakeCents: 0,
            biggestBetCents: 0,
            commentCount: 0,
        };
    }
}

// Get stats for multiple markets at once (for home page)
export async function getMarketsStats(marketIds: string[]): Promise<Record<string, MarketStats>> {
    const stats: Record<string, MarketStats> = {};

    // Initialize with defaults
    for (const id of marketIds) {
        stats[id] = {
            totalVolumeCents: 0,
            yesPercentage: 50,
            noPercentage: 50,
            totalBets: 0,
            averageStakeCents: 0,
            biggestBetCents: 0,
            commentCount: 0,
        };
    }

    try {
        // Get all bet items for these markets
        const betItemsData = await db
            .select({
                marketId: betItems.marketId,
                stakeCents: bets.stakeCents,
                optionLabel: marketOptions.label,
            })
            .from(betItems)
            .innerJoin(bets, eq(betItems.betId, bets.id))
            .innerJoin(marketOptions, eq(betItems.marketOptionId, marketOptions.id));

        // Get comment counts
        const commentCounts = await db
            .select({
                marketId: comments.marketId,
                count: sql<number>`count(*)`
            })
            .from(comments)
            .groupBy(comments.marketId);

        // Process comment counts
        for (const cc of commentCounts) {
            if (stats[cc.marketId]) {
                stats[cc.marketId].commentCount = Number(cc.count);
            }
        }

        // Group bet data by market
        const marketBets: Record<string, typeof betItemsData> = {};
        for (const item of betItemsData) {
            if (!marketBets[item.marketId]) {
                marketBets[item.marketId] = [];
            }
            marketBets[item.marketId].push(item);
        }

        // Calculate stats for each market
        for (const [marketId, items] of Object.entries(marketBets)) {
            if (!stats[marketId]) continue;

            let totalVolume = 0;
            let yesVolume = 0;
            let noVolume = 0;
            let biggestBet = 0;

            for (const item of items) {
                const stake = item.stakeCents;
                totalVolume += stake;

                if (item.optionLabel.toLowerCase().includes('yes')) {
                    yesVolume += stake;
                } else {
                    noVolume += stake;
                }

                if (stake > biggestBet) {
                    biggestBet = stake;
                }
            }

            const totalBets = items.length;
            const averageStake = Math.round(totalVolume / totalBets);
            const yesPercentage = totalVolume > 0
                ? Math.round((yesVolume / totalVolume) * 100)
                : 50;

            stats[marketId] = {
                ...stats[marketId],
                totalVolumeCents: totalVolume,
                yesPercentage,
                noPercentage: 100 - yesPercentage,
                totalBets,
                averageStakeCents: averageStake,
                biggestBetCents: biggestBet,
            };
        }
    } catch (error) {
        console.error('Failed to get markets stats:', error);
    }

    return stats;
}
