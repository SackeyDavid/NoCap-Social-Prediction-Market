import { tavily, type TavilyClient } from '@tavily/core';

// Define the search options interface based on Tavily's API
export interface TavilySearchOptions {
  searchDepth?: 'basic' | 'advanced';
  topic?: 'general' | 'news';
  days?: number;
  maxResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
}

let tavilyClient: TavilyClient | null = null;

export function getTavilyClient() {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.warn('TAVILY_API_KEY not set');
    return null;
  }
  
  if (!tavilyClient) {
    tavilyClient = tavily({ apiKey: apiKey || '' });
  }
  
  return tavilyClient;
}

export async function searchTrends(query: string, options: TavilySearchOptions = {}) {
  const client = getTavilyClient();
  if (!client) {
    throw new Error('Tavily client not initialized (missing API key)');
  }

  try {
    // Default to news topic and recent 3 days
    const response = await client.search(query, {
      topic: options.topic || 'news',
      days: options.days || 3,
      maxResults: options.maxResults || 10,
      searchDepth: options.searchDepth || 'basic',
      includeAnswer: true,
      ...options
    });
    
    return response;
  } catch (error) {
    console.error('Tavily search failed:', error);
    return { results: [], answer: '' };
  }
}
