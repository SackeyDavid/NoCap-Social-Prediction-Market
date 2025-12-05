'use client'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Market {
  id: string;
  title: string;
  slug: string;
  category: string;
  sourceType: string;
  closesAt: Date | string;
  options?: { id: string; label: string; marketId: string }[];
  stats?: {
    totalVolumeCents: number;
    yesPercentage: number;
    noPercentage: number;
    totalBets: number;
    commentCount: number;
  };
}

export function MarketCard({ market }: { market: Market }) {
  const navigate = useRouter().push;
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);
  const [stake, setStake] = useState('10');
  const [loading, setLoading] = useState(false);

  // Use real stats from server, fallback to deterministic values
  const hash = market.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const yesPercentage = market.stats?.yesPercentage ?? ((hash % 60) + 20);
  const noPercentage = market.stats?.noPercentage ?? (100 - yesPercentage);
  const commentCount = market.stats?.commentCount ?? 0;
  const totalVolume = market.stats?.totalVolumeCents ?? 0;

  const handleSelection = (selection: 'yes' | 'no', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOption(selection);
    setShowBetModal(true);
  };

  const handlePlaceBet = async () => {
    if (!selectedOption) return;

    setLoading(true);
    try {
      const stakeCents = Math.floor(parseFloat(stake) * 100);
      const option = (market as any).options?.find((o: any) =>
        o.label.toLowerCase().includes(selectedOption)
      );

      if (!option) {
        alert('Option not found');
        return;
      }

      const { placeBet } = await import('@/app/actions/bets');
      const res = await placeBet(market.id, option.id, stakeCents);

      if (res.success) {
        alert('Bet placed! Good luck! 🍀 No Cap!');
        setShowBetModal(false);
        setSelectedOption(null);
        setStake('10');
      } else {
        alert('Error: ' + res.error);
      }
    } catch (e) {
      alert('Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/markets/${market.slug}`} className="block">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all cursor-pointer group">

        {/* Card Image */}
        <div className="h-32 relative overflow-hidden">
          <img
            src={`https://image.pollinations.ai/prompt/wide%20landscape%20photo%20of%20${encodeURIComponent(market.title)}%20${encodeURIComponent(market.category)}%20context%20high%20quality%204k?width=800&height=400&nologo=true&seed=${hash}`}
            alt={market.title}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
          <div className="absolute bottom-2 left-4">
            <div className="inline-block px-2 py-0.5 bg-black/60 backdrop-blur-md text-white/90 border border-white/10 rounded-full text-[10px] uppercase tracking-wider font-bold">
              {market.category}
            </div>
          </div>
        </div>

        <div className="p-5 pt-3">

          {/* Question */}
          <h3 className="text-white mb-4 text-lg font-medium leading-snug">{market.title}</h3>

          {/* Progress Bar */}
          <div className="relative h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00FF94] to-[#00FF94]/80"
              style={{ width: `${yesPercentage}%` }}
            />
            <div
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-[#FF0055] to-[#FF0055]/80"
              style={{ width: `${noPercentage}%` }}
            />
          </div>

          {/* Percentages */}
          <div className="flex justify-between mb-4 text-sm">
            <span className="text-[#00FF94] font-mono font-bold">{yesPercentage}% Yes</span>
            <span className="text-[#FF0055] font-mono font-bold">{noPercentage}% No</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={(e) => handleSelection('no', e)}
              className="flex-1 h-12 bg-[#FF0055] hover:bg-[#FF0055]/90 text-white rounded-full transition-all active:scale-95 font-bold text-sm"
            >
              Cap (No)
            </button>
            <button
              onClick={(e) => handleSelection('yes', e)}
              className="flex-1 h-12 bg-[#00FF94] hover:bg-[#00FF94]/90 text-black rounded-full transition-all active:scale-95 font-bold text-sm"
            >
              No Cap (Yes)
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <div className="flex items-center gap-1">
              <MessageCircle size={16} />
              <span>{commentCount}</span>
            </div>
            <span>₵{(totalVolume / 1000).toFixed(1)}k volume</span>
          </div>
        </div>
      </div>

      {/* Bet Modal */}
      {showBetModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowBetModal(false);
          }}
        >
          <div
            className="bg-[#1A1A1A] w-full max-w-md rounded-t-3xl p-6 border-t border-white/10 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Place Bet on {selectedOption === 'yes' ? 'Yes' : 'No'}
              </h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowBetModal(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Stake (GHS)</label>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  min="1"
                  className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white text-lg font-mono px-4 focus:outline-none focus:ring-2 focus:ring-[#00FF94] focus:border-[#00FF94]"
                />
              </div>

              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-gray-400 text-sm">Potential Return (1.9x)</span>
                <span className="font-bold text-[#00FF94] text-xl font-mono">
                  GHS {(parseFloat(stake || '0') * 1.9).toFixed(2)}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePlaceBet();
                }}
                disabled={loading}
                className="w-full h-14 bg-[#2E5CFF] hover:bg-[#2E5CFF]/90 text-white rounded-full font-bold text-lg disabled:opacity-50"
              >
                {loading ? 'Placing Bet...' : 'Confirm Bet 🚀'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Link>
  )
}
