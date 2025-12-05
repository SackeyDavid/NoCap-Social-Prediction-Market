'use client'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Market {
  id: string;
  title: string;
  slug: string;
  category: string;
  sourceType: string;
  closesAt: Date | string;
}

export function MarketCard({ market }: { market: Market }) {
  const navigate = useRouter().push;

  // Mock data for UI matching since backend doesn't compute these yet
  // Deterministic pseudo-random based on market ID to avoid hydration mismatch
  const hash = market.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const yesPercentage = (hash % 60) + 20; // 20-80%
  const noPercentage = 100 - yesPercentage;
  const commentCount = hash % 50;
  const totalVolume = (hash % 10000) + 1000;

  const handleSelection = (selection: 'yes' | 'no', e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    // Navigate to betting page with selection pre-selected?
    // For now just go to page
    navigate(`/markets/${market.slug}`);
  };

  return (
    <Link href={`/markets/${market.slug}`} className="block">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:border-white/20 transition-all cursor-pointer">

        {/* Category Badge */}
        <div className="inline-block px-3 py-1 bg-[#2E5CFF]/20 text-[#2E5CFF] rounded-full text-xs mb-3 capitalize font-medium">
          {market.category}
        </div>

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
    </Link>
  )
}
