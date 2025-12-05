import { NextRequest, NextResponse } from 'next/server';
import { fetchTrendingTopics } from '@/lib/fetch-trends';
import { generatePredictionsFromTopics } from '@/lib/generate-predictions';
import { insertMarketsFromPredictions } from '@/lib/insert-markets';

// Force dynamic to avoid caching this cron route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const adminSecret = process.env.ADMIN_SECRET || 'dev-secret';

  // Simple admin token check
  if (token !== adminSecret) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting AI Trend Agent (Tavily + OpenAI)...');
    
    // 1. Fetch Trends
    const topics = await fetchTrendingTopics();
    
    // 2. Generate Predictions
    const predictions = await generatePredictionsFromTopics(topics);
    
    // 3. Insert Markets
    const createdCount = await insertMarketsFromPredictions(predictions);

    // Determine status code based on whether we actually created something or if we had a partial failure
    // If we fetched topics but generated 0 predictions, it might be due to errors (like 429 caught inside)
    // or just no valid topics. 
    const status = createdCount > 0 || predictions.length > 0 ? 200 : 200; 
    // Keeping 200 for now as long as the agent ran successfully without throwing.

    return NextResponse.json({
        success: true,
        topicsFetched: topics.length,
        predictionsGenerated: predictions.length,
        marketsCreated: createdCount,
        note: createdCount === 0 && predictions.length > 0 ? "Predictions generated but deduplicated/filtered." : undefined
    }, { status });

  } catch (error: any) {
    console.error('AI Trend Agent Failed:', error);
    
    // Specific handling for known errors if they bubble up
    if (error?.status === 429) {
        return NextResponse.json({ error: 'OpenAI Rate Limit Exceeded', details: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
