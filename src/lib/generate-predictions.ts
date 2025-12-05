import { GoogleGenerativeAI } from '@google/generative-ai';
import { NormalizedTopic } from './fetch-trends';

export interface GeneratedPrediction {
  title: string;
  category: string;
  closesAt: string; // ISO date string
  confidence: number;
  sourceUrl?: string;
}

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

export async function generatePredictionsFromTopics(topics: NormalizedTopic[]): Promise<GeneratedPrediction[]> {
  const genAI = getGemini();
  if (!genAI || topics.length === 0) return [];

  // Process in batches to avoid context window limits
  const BATCH_SIZE = 10;
  const allValidPredictions: GeneratedPrediction[] = [];

  for (let i = 0; i < topics.length; i += BATCH_SIZE) {
    const batch = topics.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(topics.length / BATCH_SIZE)} (${batch.length} topics)`);

    // Use 'gemini-2.0-flash' as 1.5 is deprecated/unavailable
    // Alternatively 'gemini-2.0-pro'
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are an expert prediction market maker for "NoCap", an app for African Gen-Z users.
Your goal is to create FUN, VIRAL, and FUTURE-ORIENTED prediction markets based on current news FROM AFRICA.

CRITICAL RULES:
1. ONLY generate questions about FUTURE outcomes happening within the NEXT 1-3 DAYS.
2. DO NOT generate questions about events that have already happened.
3. Each question must have a clear deadline (Closing Date) between 24 and 72 hours from now.
4. Categories must be one of: music, sports, politics, entertainment, crypto, culture.
5. Focus on SHORT TERM, HIGH VELOCITY events (e.g. "Will [Team] win tomorrow?", "Will [Coin] hit $X by Friday?").
6. Confidence score (0-1) represents how clear and unambiguous the resolution criteria would be.
7. FOCUS ON AFRICA - Nigerian music, Ghanaian football, South African politics, Kenyan tech, etc.
8. Include events from: Nigeria, Ghana, Kenya, South Africa, Egypt, Tanzania, Rwanda, Senegal, Ethiopia, Uganda.

AFRICAN FOCUS EXAMPLES:
- "Will Asake drop a new single this week?"
- "Will Ghana Black Stars win their next AFCON qualifier?"
- "Will Kenya's Central Bank announce crypto regulations by Friday?"
- "Will Burna Boy announce an African tour date?"
- "Will the Nigerian Naira strengthen against USD tomorrow?"
- "Will Amapiano dominate the SA charts this weekend?"

Here are the trending topics:
${JSON.stringify(batch.map(t => ({ title: t.title, snippet: t.snippet, published: t.publishedAt })), null, 2)}

Output valid JSON only. Do not wrap in markdown. The format should be:
{
  "predictions": [
    { 
      "title": "Will [Artist] drop the album [Name] by Friday?",
      "category": "music",
      "closesAt": "2024-12-31T23:59:00Z",
      "confidence": 0.9,
      "sourceTitleReference": "Title of the source topic used" 
    }
  ]
}
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean up markdown formatting if present
      if (text.startsWith('```json')) {
        text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (text.startsWith('```')) {
        text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // console.log("Gemini Raw Content:", text); // DEBUG LOG

      let parsed;
      try {
        parsed = JSON.parse(text || '{}');
      } catch (parseError) {
        console.error("Failed to parse Gemini JSON for batch:", parseError);
        continue;
      }

      const rawPredictions = parsed.predictions || [];
      // console.log(`Raw Predictions count: ${rawPredictions.length}`); // DEBUG LOG

      // Post-validation
      const now = new Date();

      for (const p of rawPredictions) {
        // 1. Check date validity
        const closeDate = new Date(p.closesAt);
        if (isNaN(closeDate.getTime()) || closeDate <= now) {
          // console.log(`Dropping prediction "${p.title}": Invalid or past date (${p.closesAt})`);
          continue; // Invalid or past date
        }

        // 2. Check blacklisted keywords for past events
        const lowerTitle = p.title.toLowerCase();
        if (lowerTitle.startsWith('did ') || lowerTitle.includes(' was ') || lowerTitle.includes(' were ')) {
          // console.log(`Dropping prediction "${p.title}": Past tense keyword detected`);
          continue;
        }

        // Find source URL if possible (fuzzy match)
        const sourceTopic = topics.find(t =>
          t.title === p.sourceTitleReference ||
          (p.sourceTitleReference && t.title.includes(p.sourceTitleReference.substring(0, 10)))
        );

        allValidPredictions.push({
          title: p.title,
          category: p.category,
          closesAt: p.closesAt,
          confidence: p.confidence,
          sourceUrl: sourceTopic?.url
        });
      }

    } catch (e) {
      console.error('Error generating predictions with Gemini for batch:', e);
    }

    // Optional: Add a small delay to avoid rate limits if needed
    // await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`Total Valid Predictions count: ${allValidPredictions.length}`);
  return allValidPredictions;

}
