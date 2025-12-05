'use client'

import { useState, useRef, useEffect } from 'react'
import { MarketCard } from '@/components/market-card'
import { useRouter } from 'next/navigation'

interface HomeClientProps {
    initialMarkets: any[]
}

export function HomeClient({ initialMarkets }: HomeClientProps) {
    const [markets, setMarkets] = useState(initialMarkets)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [pullDistance, setPullDistance] = useState(0)
    const touchStartY = useRef(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

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

            {/* Story Bubbles - Categories */}
            <div className="mt-6 mb-8 px-4">
                <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
                    {Array.from(new Set(markets.map(m => m.category))).map(category => (
                        <div key={category} className="flex flex-col items-center gap-2 min-w-[64px]">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-[#00FF94] p-[2px] flex items-center justify-center">
                                <span className="text-2xl capitalize">
                                    {category === 'music' ? '🎵' : category === 'sports' ? '⚽' : category === 'politics' ? '🗳️' : category === 'crypto' ? '₿' : '🌍'}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400 capitalize">{category}</span>
                        </div>
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
