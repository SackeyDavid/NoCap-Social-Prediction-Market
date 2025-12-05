'use server'

import { db } from '@/db'
import { markets, marketOptions } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function getMarkets() {
  try {
      // Prevent DB calls if env var is missing during build (optional safety)
      if (!process.env.DATABASE_URL) {
          console.warn('getMarkets called without DATABASE_URL');
          return [];
      }

      const allMarkets = await db.query.markets.findMany({
        where: eq(markets.status, 'open'),
        orderBy: [desc(markets.createdAt)],
        limit: 20,
        with: {
          // Assuming we might define relations later, but for now just fetch markets
        }
      });
      return allMarkets;
  } catch (e) {
      console.error('Failed to fetch markets:', e);
      return [];
  }
}

export async function getMarketBySlug(slug: string) {
  try {
      if (!process.env.DATABASE_URL) return null;

      const market = await db.query.markets.findFirst({
        where: eq(markets.slug, slug),
      });
      
      if (!market) return null;

      const options = await db.select().from(marketOptions).where(eq(marketOptions.marketId, market.id));
      
      return { ...market, options };
  } catch (e) {
      console.error(`Failed to fetch market ${slug}:`, e);
      return null;
  }
}
