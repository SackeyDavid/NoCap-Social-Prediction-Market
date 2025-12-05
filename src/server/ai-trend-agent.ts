// DEPRECATED: This file is no longer used.
// The AI Trend Agent logic has been modularized into:
// - src/lib/fetch-trends.ts (Tavily)
// - src/lib/generate-predictions.ts (OpenAI)
// - src/lib/insert-markets.ts (DB)
// - src/app/api/admin/run-trend-agent/route.ts (Controller)

export async function runTrendAgent() {
  console.warn('runTrendAgent from src/server/ai-trend-agent.ts is deprecated.');
  return { created: 0, message: "Deprecated" };
}
