import { getMarkets } from './actions/markets'
import { MarketCard } from '@/components/market-card'

// This page is dynamic because it fetches data from the DB that changes often
export const dynamic = 'force-dynamic';

export default async function Home() {
  const markets = await getMarkets()

  return (
    <div className="pb-24">
      {/* Story Bubbles - Categories */}
      <div className="mt-6 mb-8">
        <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
          {Array.from(new Set(markets.map(m => m.category))).map(category => (
            <div key={category} className="flex flex-col items-center gap-2 min-w-[64px]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-[#00FF94] p-[2px] flex items-center justify-center">
                <span className="text-2xl capitalize">{category === 'music' ? '🎵' : category === 'sports' ? '⚽' : category === 'politics' ? '🗳️' : category === 'crypto' ? '₿' : '🌍'}</span>
              </div>
              <span className="text-xs text-gray-400 capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-bold">Trending Now</h3>
          <span className="text-gray-400 text-sm">{markets.length} markets</span>
        </div>

        <div className="space-y-6">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
          {markets.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground border border-white/10 border-dashed rounded-3xl bg-white/5">
              No active markets found.
              <br /><span className="text-sm text-gray-500">Wait for the AI agent to cook something up! 🍳</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
