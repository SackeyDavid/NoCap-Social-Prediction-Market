'use client'

import { useState, useRef, useEffect } from 'react'
import { MarketCard } from '@/components/market-card'
import { useRouter } from 'next/navigation'
import { getMarkets } from '@/app/actions/markets'

interface HomeClientProps {
    initialMarkets: any[]
}

export function HomeClient({ initialMarkets }: HomeClientProps) {
    const [markets, setMarkets] = useState(initialMarkets)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [pullDistance, setPullDistance] = useState(0)
    const [lastUpdated, setLastUpdated] = useState(new Date())
    const touchStartY = useRef(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const newMarkets = await getMarkets()
                if (newMarkets.length !== markets.length ||
                    (newMarkets[0]?.id !== markets[0]?.id)) {
                    setMarkets(newMarkets)
                    setLastUpdated(new Date())
                }
            } catch (error) {
                console.error('Auto-refresh failed:', error)
            }
        }, 30000) // 30 seconds

        return () => clearInterval(interval)
    }, [markets])

    // Update markets when initialMarkets prop changes
    useEffect(() => {
        setMarkets(initialMarkets)
    }, [initialMarkets])

    const handleTouchStart = (e: React.TouchEvent) => {
        if (containerRef.current && containerRef.current.scrollTop === 0) {
            touchStartY.current = e.touches[0].clientY
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (containerRef.current && containerRef.current.scrollTop === 0 && !isRefreshing) {
            const currentY = e.touches[0].clientY
            const distance = currentY - touchStartY.current

            if (distance > 0) {
                setPullDistance(Math.min(distance, 120))
            }
        }
    }

    const handleTouchEnd = async () => {
        if (pullDistance > 80 && !isRefreshing) {
            setIsRefreshing(true)

            try {
                // Trigger the agent to generate new markets
                const response = await fetch('/api/admin/run-trend-agent?token=' + (process.env.NEXT_PUBLIC_ADMIN_SECRET || 'dev-secret'))

                if (response.ok) {
                    // Refresh the page to show new markets
                    router.refresh()
                }
            } catch (error) {
                console.error('Failed to refresh markets:', error)
            } finally {
                setTimeout(() => {
                    setIsRefreshing(false)
                    setPullDistance(0)
                }, 500)
            }
        } else {
            setPullDistance(0)
        }
    }

    return (
        <div
            ref={containerRef}
            className="pb-24 overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull to Refresh Indicator */}
            <div
                className="flex items-center justify-center transition-all duration-200"
                style={{
                    height: pullDistance,
                    opacity: pullDistance / 80,
                }}
            >
                <div className={`text-[#00FF94] ${isRefreshing ? 'animate-spin' : ''}`}>
                    {isRefreshing ? '⟳' : '↓'}
                </div>
                <span className="text-gray-400 text-sm ml-2">
                    {isRefreshing ? 'Fetching new markets...' : pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
                </span>
            </div>

            {/* Category Bubbles */}
            <div className="mt-6 mb-8 px-4">
                <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
                    {[
                        { name: 'music', emoji: '🎵', color: '#FF6B35', image: 'concert%20crowd%20neon%20lights' },
                        { name: 'sports', emoji: '⚽', color: '#00FF94', image: 'stadium%20soccer%20field' },
                        { name: 'local', emoji: '🏙️', color: '#FFD700', image: 'african%20city%20street%20market' },
                        { name: 'entertainment', emoji: '🎬', color: '#FF0055', image: 'movie%20premiere%20red%20carpet' },
                        { name: 'crypto', emoji: '₿', color: '#F7931A', image: 'bitcoin%20digital%20currency' },
                        { name: 'culture', emoji: '🌍', color: '#9B59B6', image: 'diverse%20people%20city' },
                    ].map(cat => (
                        <a
                            key={cat.name}
                            href={`/category/${cat.name}`}
                            className="flex flex-col items-center gap-2 min-w-[72px] group"
                        >
                            <div
                                className="w-16 h-16 rounded-full p-[2px] relative overflow-hidden transition-transform group-hover:scale-110"
                                style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}80)` }}
                            >
                                <div className="w-full h-full rounded-full overflow-hidden relative">
                                    <img
                                        src={`https://image.pollinations.ai/prompt/${cat.image}%20abstract%20icon?width=200&height=200&nologo=true&seed=${cat.name.length * 100}`}
                                        alt={cat.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-2xl">{cat.emoji}</span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 capitalize font-medium group-hover:text-white transition-colors">{cat.name}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Markets Grid */}
            <div className="px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Trending Markets</h2>
                    <span className="text-sm text-gray-400">{markets.length} live</span>
                </div>

                <div className="space-y-6">
                    {markets.map(m => (
                        <MarketCard key={m.id} market={m} />
                    ))}
                </div>
            </div>
        </div>
    )
}
