import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { getMarkets } from '@/app/actions/markets'
import { MarketCard } from '@/components/market-card'

// Force dynamic to avoid build-time static generation failing on DB connection
export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const markets = await getMarkets() 
  const categories = ['All', 'Music', 'Sports', 'Politics', 'Crypto', 'Culture']

  return (
    <div className="space-y-6 pb-24">
       <div className="flex flex-col gap-4 px-2">
          <h1 className="text-2xl font-bold text-white">Explore 🧭</h1>
          <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <Input 
                placeholder="Search markets..." 
                className="pl-12 h-12 bg-white/5 border-white/10 rounded-full text-white placeholder:text-gray-500 focus-visible:ring-[#00FF94] focus-visible:border-[#00FF94]" 
              />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                  <button 
                    key={cat} 
                    className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        cat === 'All' 
                        ? 'bg-[#00FF94] text-black' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
       </div>

       <div className="space-y-6 px-2">
          {markets.map(m => (
              <MarketCard key={m.id} market={m} />
          ))}
       </div>
    </div>
  )
}
