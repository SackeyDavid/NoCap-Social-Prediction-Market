import { searchTrends } from './tavily-client';

export interface NormalizedTopic {
  title: string;
  url?: string;
  snippet?: string;
  publishedAt?: string | null; // ISO string
  category: 'music' | 'sports' | 'politics' | 'entertainment' | 'crypto' | 'culture' | 'other';
  region?: string;
}

// Queries to capture African/Glocal trends
const TREND_QUERIES = [
  { query: "What is trending right now in Ghana?", region: "Ghana" },
  { query: "What is trending right now in Nigeria?", region: "Nigeria" },
  { query: "What is trending right now in Kenya?", region: "Kenya" },
  { query: "What is trending right now in South Africa?", region: "South Africa" },
  { query: "African entertainment trending today", region: "Africa" },
  { query: "Latest viral celebrity controversy Africa", region: "Africa" },
  { query: "Sports trending this week Africa", region: "Africa" },
];

function determineCategory(text: string): NormalizedTopic['category'] {
  const lower = text.toLowerCase();
  if (lower.match(/grammy|artist|song|album|music|concert|rapper|afrobeats/)) return 'music';
  if (lower.match(/match|league|fc|goal|cup|tournament|football|soccer|nba/)) return 'sports';
  if (lower.match(/president|election|parliament|minister|government|vote/)) return 'politics';
  if (lower.match(/movie|tv|netflix|series|big brother|bbnaija|celebrity|drama|actor/)) return 'entertainment';
  if (lower.match(/bitcoin|crypto|token|ethereum|blockchain|nft/)) return 'crypto';
  return 'culture'; // Default fallback
}

function isOutdated(snippet: string, publishedDate?: string | null): boolean {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // 1. Check published date if available
  if (publishedDate) {
    const date = new Date(publishedDate);
    if (!isNaN(date.getTime()) && date < sevenDaysAgo) {
      return true;
    }
  }

  // 2. Check text for past years
  const pastYears = ['2020', '2021', '2022', '2023'];
  // Be careful with current year (2024/2025) depending on context, but definitely filter old ones
  if (pastYears.some(y => snippet.includes(y))) {
    // Simple heuristic: if it mentions old years, it's likely old news or retrospective
    return true;
  }

  // 3. Check specific resolved events (manual list could be expanded)
  const resolvedKeywords = ['won the 2023', 'election results 2023', 'world cup 2022'];
  if (resolvedKeywords.some(k => snippet.toLowerCase().includes(k))) {
    return true;
  }

  return false;
}

export async function fetchTrendingTopics(): Promise<NormalizedTopic[]> {
  const allTopics: NormalizedTopic[] = [];
  const seenTitles = new Set<string>();

  console.log('Fetching trends from Tavily...');

  for (const { query, region } of TREND_QUERIES) {
    try {
      // Search news from last 3 days
      const response = await searchTrends(query, {
        topic: 'news',
        days: 3,
        maxResults: 15 // Increased from 5 to capture more trends
      });

      if (!response.results) continue;

      for (const result of response.results) {
        // Basic deduplication
        const normalizedTitle = result.title.toLowerCase().replace(/[^\w\s]/g, '');
        if (seenTitles.has(normalizedTitle)) continue;

        // Check outdated
        if (isOutdated(result.content || result.title, result.publishedDate)) {
          continue;
        }

        seenTitles.add(normalizedTitle);

        allTopics.push({
          title: result.title,
          url: result.url,
          snippet: result.content,
          publishedAt: result.publishedDate || null,
          category: determineCategory(result.title + " " + result.content),
          region
        });
      }
    } catch (e) {
      console.error(`Failed to fetch trends for query: ${query}`, e);
    }
  }

  console.log(`Fetched ${allTopics.length} raw topics.`);
  return allTopics; // Removed slice limit to return all unique topics
}
