'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, MessageCircle, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { placeBet } from '@/app/actions/bets';
import { useAuth } from '@/hooks/use-auth';

// Mock Data
const priceHistory = [
    { time: '12h', yes: 45, no: 55 },
    { time: '10h', yes: 48, no: 52 },
    { time: '8h', yes: 52, no: 48 },
    { time: '6h', yes: 58, no: 42 },
    { time: '4h', yes: 62, no: 38 },
    { time: '2h', yes: 65, no: 35 },
    { time: 'now', yes: 65, no: 35 }
];

const mockChatMessages = [
    { id: 1, username: 'CryptoKing', message: 'This is definitely happening! 🚀', timestamp: '2m ago', avatar: '👑' },
    { id: 2, username: 'NoCapUser', message: 'I doubt it, the odds are too high.', timestamp: '5m ago', avatar: '🧢' },
    { id: 3, username: 'TraderX', message: 'Just put 500 on Yes.', timestamp: '12m ago', avatar: '📈' },
];

interface MarketDetailClientProps {
    market: any;
    user: any;
}

export function MarketDetailClient({ market, user }: MarketDetailClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'streets' | 'history' | 'stats'>('streets');
    const [stake, setStake] = useState<string>('10');
    const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);
    const [loading, setLoading] = useState(false);

    // Deterministic stats based on market ID
    const hash = market.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const yesPercentage = (hash % 60) + 20;
    const noPercentage = 100 - yesPercentage;
    const totalVolume = (hash % 10000) + 1000;
    const commentCount = hash % 50;

    const handleBet = async () => {
        if (!user) {
            alert('Please login to bet');
            return;
        }
        if (!selectedOption) return;

        setLoading(true);
        try {
            const stakeCents = Math.floor(parseFloat(stake) * 100);
            // Find option ID based on selection label
            const option = market.options.find((o: any) => o.label.toLowerCase().includes(selectedOption));

            if (!option) {
                alert('Option not found');
                return;
            }

            const res = await placeBet(market.id, option.id, stakeCents);

            if (res.success) {
                alert('Bet placed! Good luck! 🍀 No Cap!');
                setSelectedOption(null);
            } else {
                alert('Error: ' + res.error);
            }
        } catch (e) {
            alert('Failed to place bet');
        } finally {
            setLoading(false);
        }
    };

    // Dynamic image generation using Pollinations.ai
    // This generates a unique, relevant image for every market based on its title
    const encodedTitle = encodeURIComponent(market.title);
    const encodedCategory = encodeURIComponent(market.category);
    const imageUrl = `https://image.pollinations.ai/prompt/cinematic%20photo%20of%20${encodedTitle}%20${encodedCategory}%20context%20high%20quality%204k?width=1080&height=720&nologo=true&seed=${hash}`;

    return (
        <div className="min-h-screen bg-[#050505] pb-32">
            {/* Header Image */}
            <div className="relative h-64 bg-gray-900">
                <img
                    src={imageUrl}
                    alt={market.category}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

                <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-6 z-10">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-lg rounded-full hover:bg-black/70 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-white" />
                    </button>

                    <button className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-lg rounded-full hover:bg-black/70 transition-colors">
                        <Share2 size={20} className="text-white" />
                    </button>
                </div>

                <div className="absolute bottom-4 left-6 z-10">
                    <div className="inline-block px-3 py-1 bg-[#2E5CFF]/80 backdrop-blur-lg text-white rounded-full text-xs mb-4 capitalize font-bold shadow-lg">
                        {market.category}
                    </div>
                </div>
            </div>
            {/* Content */}
            <div className="px-6 -mt-6 relative z-10">
                {/* Question Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-6">
                    <h2 className="text-white mb-4 text-xl font-bold leading-snug">{market.title}</h2>

                    {/* Sentiment Bar */}
                    <div className="relative h-3 bg-white/10 rounded-full mb-3 overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-[#00FF94]"
                            style={{ width: `${yesPercentage}%` }}
                        />
                    </div>

                    <div className="flex justify-between mb-6">
                        <span className="text-[#00FF94] font-mono font-bold">{yesPercentage}% Yes</span>
                        <span className="text-[#FF0055] font-mono font-bold">{noPercentage}% No</span>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-sm text-gray-400">
                        <div>
                            <span className="block text-white font-mono">₵{(totalVolume / 1000).toFixed(1)}k</span>
                            <span>Volume</span>
                        </div>
                        <div>
                            <span className="block text-white font-mono">{commentCount}</span>
                            <span>Comments</span>
                        </div>
                        <div>
                            <span className="block text-white font-mono">{new Date(market.closesAt).getDate()} {new Date(market.closesAt).toLocaleString('default', { month: 'short' })}</span>
                            <span>Ends</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('streets')}
                        className={`flex-1 h-12 rounded-full transition-all whitespace-nowrap px-4 flex items-center justify-center ${activeTab === 'streets'
                            ? 'bg-[#00FF94] text-black font-bold'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <MessageCircle size={18} className="inline mr-2" />
                        The Streets
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 h-12 rounded-full transition-all whitespace-nowrap px-4 flex items-center justify-center ${activeTab === 'history'
                            ? 'bg-[#00FF94] text-black font-bold'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <BarChart3 size={18} className="inline mr-2" />
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`flex-1 h-12 rounded-full transition-all whitespace-nowrap px-4 flex items-center justify-center ${activeTab === 'stats'
                            ? 'bg-[#00FF94] text-black font-bold'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        Stats
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mb-6">
                    {activeTab === 'streets' && (
                        <div className="space-y-4">
                            {mockChatMessages.map((msg) => (
                                <div key={msg.id} className="flex gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#00FF94] to-[#2E5CFF] rounded-full flex items-center justify-center flex-shrink-0 text-lg">
                                        {msg.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-white text-sm font-bold">{msg.username}</span>
                                            <span className="text-gray-500 text-xs">{msg.timestamp}</span>
                                        </div>
                                        <p className="text-gray-300 text-sm">{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={priceHistory}>
                                    <XAxis dataKey="time" stroke="#B5B5B5" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#B5B5B5" fontSize={12} tickLine={false} axisLine={false} />
                                    <Line type="monotone" dataKey="yes" stroke="#00FF94" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="no" stroke="#FF0055" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 space-y-4">
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-gray-400">Total Bets</span>
                                <span className="text-white font-mono">2,456</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-gray-400">Average Stake</span>
                                <span className="text-white font-mono">₵18.34</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Biggest Bet</span>
                                <span className="text-white font-mono">₵500.00</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Betting Overlay / Bottom Sheet */}
            {selectedOption && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
                    <div className="bg-[#1A1A1A] w-full max-w-md rounded-t-3xl p-6 border-t border-white/10 animate-in slide-in-from-bottom">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Place Bet on {selectedOption === 'yes' ? 'Yes' : 'No'}</h3>
                            <button onClick={() => setSelectedOption(null)} className="text-gray-400 hover:text-white">✕</button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Stake (GHS)</label>
                                <Input
                                    type="number"
                                    value={stake}
                                    onChange={e => setStake(e.target.value)}
                                    min="1"
                                    className="h-14 rounded-2xl bg-white/5 border-white/10 text-white text-lg font-mono focus-visible:ring-[#00FF94] focus-visible:border-[#00FF94]"
                                />
                            </div>

                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-gray-400 text-sm">Potential Return (1.9x)</span>
                                <span className="font-bold text-[#00FF94] text-xl font-mono">GHS {(parseFloat(stake || '0') * 1.9).toFixed(2)}</span>
                            </div>

                            <Button
                                onClick={handleBet}
                                disabled={loading}
                                className="w-full h-14 bg-[#2E5CFF] hover:bg-[#2E5CFF]/90 text-white rounded-full font-bold text-lg"
                            >
                                {loading ? 'Placing Bet...' : 'Confirm Bet 🚀'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fixed Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-white/10 p-6 max-w-md mx-auto z-40">
                <div className="flex gap-3">
                    <Button
                        onClick={() => setSelectedOption('no')}
                        className="flex-1 h-14 bg-[#FF0055] hover:bg-[#FF0055]/90 text-white rounded-full font-bold text-lg"
                    >
                        Cap (No)
                    </Button>
                    <Button
                        onClick={() => setSelectedOption('yes')}
                        className="flex-1 h-14 bg-[#00FF94] hover:bg-[#00FF94]/90 text-black rounded-full font-bold text-lg"
                    >
                        No Cap (Yes)
                    </Button>
                </div>
            </div>
        </div>
    );
}
