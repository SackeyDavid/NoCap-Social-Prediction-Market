'use server'

import { db } from '@/db'
import { markets, marketOptions, bets, betItems } from '@/db/schema'
import { desc, eq, sql } from 'drizzle-orm'

export interface MarketWithStats {
  id: string;
  title: string;
  slug: string;
  category: string;
  sourceType: string;
  status: string;
  closesAt: Date;
  createdAt: Date;
  options: { id: string; label: string; marketId: string }[];
  stats: {
    totalVolumeCents: number;
    yesPercentage: number;
    noPercentage: number;
    totalBets: number;
    commentCount: number;
  };
}

export async function getMarkets(): Promise<MarketWithStats[]> {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('getMarkets called without DATABASE_URL');
      return [];
    }

    const allMarkets = await db.query.markets.findMany({
      where: eq(markets.status, 'open'),
      orderBy: [desc(markets.createdAt)],
      limit: 20,
      with: {
        options: true,
        betItems: true,
      }
    });

    // Get bet data for stats calculation
    const marketIds = allMarkets.map(m => m.id);

    // Get all bets for these markets
    const allBetItems = await db
      .select({
        marketId: betItems.marketId,
        optionId: betItems.marketOptionId,
        stakeCents: bets.stakeCents,
      })
      .from(betItems)
      .innerJoin(bets, eq(betItems.betId, bets.id));

    // Calculate stats per market
    const statsMap: Record<string, { totalVolume: number; yesVolume: number; totalBets: number }> = {};

    for (const item of allBetItems) {
      if (!statsMap[item.marketId]) {
        statsMap[item.marketId] = { totalVolume: 0, yesVolume: 0, totalBets: 0 };
      }
      statsMap[item.marketId].totalVolume += item.stakeCents;
      statsMap[item.marketId].totalBets += 1;

      // Check if this is a "yes" bet by looking at the option
      const market = allMarkets.find(m => m.id === item.marketId);
      const option = market?.options.find(o => o.id === item.optionId);
      if (option?.label.toLowerCase().includes('yes')) {
        statsMap[item.marketId].yesVolume += item.stakeCents;
      }
    }

    return allMarkets.map(market => {
      const stats = statsMap[market.id] || { totalVolume: 0, yesVolume: 0, totalBets: 0 };
      const yesPercentage = stats.totalVolume > 0
        ? Math.round((stats.yesVolume / stats.totalVolume) * 100)
        : 50;

      return {
        id: market.id,
        title: market.title,
        slug: market.slug,
        category: market.category,
        sourceType: market.sourceType,
        status: market.status,
        closesAt: market.closesAt,
        createdAt: market.createdAt,
        options: market.options,
        stats: {
          totalVolumeCents: stats.totalVolume,
          yesPercentage,
          noPercentage: 100 - yesPercentage,
          totalBets: stats.totalBets,
          commentCount: 0, // Will be updated once comments table exists
        },
      };
    });
  } catch (e) {
    console.error('Failed to fetch markets:', e);
    return [];
  }
}

export async function getMarketBySlug(slug: string): Promise<MarketWithStats | null> {
  try {
    if (!process.env.DATABASE_URL) return null;

    const market = await db.query.markets.findFirst({
      where: eq(markets.slug, slug),
      with: {
        options: true,
      }
    });

    if (!market) return null;

    // Get bet stats for this market
    const betData = await db
      .select({
        optionId: betItems.marketOptionId,
        stakeCents: bets.stakeCents,
      })
      .from(betItems)
      .innerJoin(bets, eq(betItems.betId, bets.id))
      .where(eq(betItems.marketId, market.id));

    let totalVolume = 0;
    let yesVolume = 0;

    for (const item of betData) {
      totalVolume += item.stakeCents;
      const option = market.options.find(o => o.id === item.optionId);
      if (option?.label.toLowerCase().includes('yes')) {
        yesVolume += item.stakeCents;
      }
    }

    const yesPercentage = totalVolume > 0
      ? Math.round((yesVolume / totalVolume) * 100)
      : 50;

    return {
      id: market.id,
      title: market.title,
      slug: market.slug,
      category: market.category,
      sourceType: market.sourceType,
      status: market.status,
      closesAt: market.closesAt,
      createdAt: market.createdAt,
      options: market.options,
      stats: {
        totalVolumeCents: totalVolume,
        yesPercentage,
        noPercentage: 100 - yesPercentage,
        totalBets: betData.length,
        commentCount: 0,
      },
    };
  } catch (e) {
    console.error(`Failed to fetch market ${slug}:`, e);
    return null;
  }
}
