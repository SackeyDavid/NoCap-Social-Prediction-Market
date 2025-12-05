import 'dotenv/config';
import { fetchTrendingTopics } from '../src/lib/fetch-trends';
import { generatePredictionsFromTopics } from '../src/lib/generate-predictions';
import { insertMarketsFromPredictions } from '../src/lib/insert-markets';

async function runAgent() {
    try {
        console.log('Starting AI Trend Agent Manual Run...');

        // 1. Fetch Trends
        const topics = await fetchTrendingTopics();
        console.log(`Fetched ${topics.length} topics.`);

        // 2. Generate Predictions
        const predictions = await generatePredictionsFromTopics(topics);
        console.log(`Generated ${predictions.length} predictions.`);

        // 3. Insert Markets
        const createdCount = await insertMarketsFromPredictions(predictions);
        console.log(`Successfully created ${createdCount} new markets.`);

    } catch (error) {
        console.error('AI Trend Agent Failed:', error);
    }
    process.exit(0);
}

runAgent();
