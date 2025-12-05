'use client'

import { useState, useEffect } from 'react'
import { getMarketsNeedingResolution, resolveMarket, ResolutionOutcome } from '@/app/actions/resolution'

interface Market {
    id: string
    title: string
    slug: string
    closesAt: Date
    options: { id: string; label: string }[]
}

export default function AdminResolvePage() {
    const [markets, setMarkets] = useState<Market[]>([])
    const [loading, setLoading] = useState(true)
    const [resolving, setResolving] = useState<string | null>(null)

    useEffect(() => {
        loadMarkets()
    }, [])

    async function loadMarkets() {
        setLoading(true)
        try {
            const pending = await getMarketsNeedingResolution()
            setMarkets(pending as Market[])
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    async function handleResolve(marketId: string, outcome: ResolutionOutcome) {
        setResolving(marketId)
        try {
            const result = await resolveMarket(marketId, outcome)
            if (result.success) {
                alert(`✅ Resolved! Winners: ${result.winnerCount}, Payout: ₵${result.totalPayout}`)
                loadMarkets()
            } else {
                alert(`❌ Error: ${result.error}`)
            }
        } catch (e: any) {
            alert(`❌ Error: ${e.message}`)
        }
        setResolving(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen p-8 flex items-center justify-center">
                <div className="text-xl text-gray-400">Loading markets...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">🔧 Market Resolution</h1>
                <p className="text-gray-400 mb-8">Resolve closed markets and payout winners</p>

                {markets.length === 0 ? (
                    <div className="bg-white/5 rounded-2xl p-8 text-center">
                        <div className="text-5xl mb-4">✅</div>
                        <h2 className="text-xl font-bold mb-2">All Caught Up!</h2>
                        <p className="text-gray-400">No markets need resolution right now.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400">{markets.length} markets need resolution</p>

                        {markets.map(market => (
                            <div key={market.id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h3 className="font-bold text-lg mb-2">{market.title}</h3>
                                <p className="text-sm text-gray-400 mb-4">
                                    Closed: {new Date(market.closesAt).toLocaleString()}
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleResolve(market.id, 'yes')}
                                        disabled={resolving === market.id}
                                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        ✅ YES Won
                                    </button>
                                    <button
                                        onClick={() => handleResolve(market.id, 'no')}
                                        disabled={resolving === market.id}
                                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        ❌ NO Won
                                    </button>
                                    <button
                                        onClick={() => handleResolve(market.id, 'void')}
                                        disabled={resolving === market.id}
                                        className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        🚫 Void
                                    </button>
                                </div>

                                {resolving === market.id && (
                                    <p className="text-center text-yellow-400 mt-3">Resolving...</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 pt-8 border-t border-white/10">
                    <button
                        onClick={loadMarkets}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        🔄 Refresh List
                    </button>
                </div>
            </div>
        </div>
    )
}
