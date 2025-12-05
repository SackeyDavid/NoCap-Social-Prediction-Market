import { getLeaderboard } from '@/app/actions/leaderboard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
    const leaderboard = await getLeaderboard()

    return (
        <div className="space-y-6 pb-24 px-4 pt-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">
                    <Trophy size={20} />
                </div>
                <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
                {leaderboard.map((user, index) => {
                    const isTop3 = index < 3;
                    let rankColor = 'text-gray-500';
                    if (index === 0) rankColor = 'text-[#FFD700]'; // Gold
                    if (index === 1) rankColor = 'text-[#C0C0C0]'; // Silver
                    if (index === 2) rankColor = 'text-[#CD7F32]'; // Bronze

                    return (
                        <div key={user.userId} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <span className={`font-mono font-bold w-6 text-center ${rankColor} ${isTop3 ? 'text-xl' : ''}`}>
                                    {index + 1}
                                </span>
                                <Avatar className="w-10 h-10 border border-white/10">
                                    <AvatarImage src={user.avatarUrl || undefined} />
                                    <AvatarFallback className="bg-white/10 text-gray-400 text-xs">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-bold text-white text-sm">
                                        {user.displayName || user.email?.split('@')[0] || 'Anonymous'}
                                    </div>
                                    {isTop3 && <div className="text-[10px] text-[#00FF94] font-medium">Top Trader</div>}
                                </div>
                            </div>
                            <div className="font-mono font-bold text-[#00FF94]">
                                ₵{((user.balanceCents || 0) / 100).toFixed(2)}
                            </div>
                        </div>
                    )
                })}

                {leaderboard.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No traders yet. Be the first!
                    </div>
                )}
            </div>
        </div>
    )
}
