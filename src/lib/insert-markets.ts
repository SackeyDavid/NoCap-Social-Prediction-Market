import { db } from '@/db';
import { markets, marketOptions, aiGeneratedTopics } from '@/db/schema';
import { GeneratedPrediction } from './generate-predictions';
import { eq } from 'drizzle-orm';

export async function insertMarketsFromPredictions(predictions: GeneratedPrediction[]) {
  let createdCount = 0;
  
  for (const p of predictions) {
    if (p.confidence < 0.7) continue;

    // Normalize slug
    const slugBase = p.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    // Check for duplicate title (approximate)
    // Ideally we'd do a fuzzy match or check recent markets, but strictly check slug base for now or exact title
    const existing = await db.query.markets.findFirst({
        where: eq(markets.title, p.title)
    });
    if (existing) continue;

    try {
        // 1. Create AI Topic Log
        const [topic] = await db.insert(aiGeneratedTopics).values({
            generatedTitle: p.title,
            category: p.category,
            status: 'published',
            rawSource: { url: p.sourceUrl || 'tavily-search' }
        }).returning();

        // 2. Create Market
        const [market] = await db.insert(markets).values({
            title: p.title,
            slug,
            category: p.category,
            sourceType: 'ai_generated',
            status: 'open',
            closesAt: new Date(p.closesAt)
        }).returning();

        // 3. Create Options
        await db.insert(marketOptions).values([
            { marketId: market.id, label: 'Yes' },
            { marketId: market.id, label: 'No' }
        ]);

        // 4. Link back
        await db.update(aiGeneratedTopics)
            .set({ createdMarketId: market.id })
            .where(eq(aiGeneratedTopics.id, topic.id));

        createdCount++;

    } catch (e) {
        console.error(`Failed to insert market: ${p.title}`, e);
    }
  }

  return createdCount;
}


