import { getMarkets } from '@/app/actions/markets'
import { MarketCard } from '@/components/market-card'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const categoryInfo: Record<string, { emoji: string; color: string; description: string }> = {
    music: { emoji: '🎵', color: '#FF6B35', description: 'Predict the next hit songs, album drops, and artist moves' },
    sports: { emoji: '⚽', color: '#00FF94', description: 'Bet on games, transfers, and tournament outcomes' },
    politics: { emoji: '🗳️', color: '#2E5CFF', description: 'Forecast elections, policy changes, and global events' },
    local: { emoji: '🏙️', color: '#FFD700', description: 'Dumsor, trotro drama, market prices - real everyday life' },
    entertainment: { emoji: '🎬', color: '#FF0055', description: 'Movies, TV shows, celebrities, and viral moments' },
    crypto: { emoji: '₿', color: '#F7931A', description: 'Price predictions, regulations, and blockchain news' },
    culture: { emoji: '🌍', color: '#9B59B6', description: 'Trends, memes, and cultural phenomena' },
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const category = slug.toLowerCase()

    const info = categoryInfo[category]
    if (!info) notFound()

    const allMarkets = await getMarkets()
    const markets = allMarkets.filter(m => m.category.toLowerCase() === category)

    return (
        <div className="min-h-screen bg-[#050505] pb-24">
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${info.color}40, ${info.color}10)` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />

                <div className="absolute top-4 left-4 z-10">
                    <Link
                        href="/"
                        className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-lg rounded-full hover:bg-black/70 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-white" />
                    </Link>
                </div>

                <div className="absolute bottom-6 left-6 z-10">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                            style={{ backgroundColor: `${info.color}30`, border: `2px solid ${info.color}` }}
                        >
                            {info.emoji}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white capitalize">{category}</h1>
                            <p className="text-gray-400 text-sm">{info.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Markets */}
            <div className="px-4 -mt-4 relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-400 text-sm">{markets.length} active markets</span>
                </div>

                <div className="space-y-6">
                    {markets.map(market => (
                        <MarketCard key={market.id} market={market} />
                    ))}

                    {markets.length === 0 && (
                        <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
                            <div className="text-4xl mb-4">{info.emoji}</div>
                            <p className="text-gray-400">No active markets in this category yet.</p>
                            <p className="text-gray-500 text-sm mt-2">Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
