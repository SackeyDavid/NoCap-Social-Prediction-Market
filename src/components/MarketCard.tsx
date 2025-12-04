import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Market } from '../types';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface MarketCardProps {
  market: Market;
}

export const MarketCard = ({ market }: MarketCardProps) => {
  const navigate = useNavigate();
  const { addToBetSlip } = useApp();
  
  const handleSelection = (selection: 'yes' | 'no', e: React.MouseEvent) => {
    e.stopPropagation();
    const odds = selection === 'yes' 
      ? (100 / market.yesPercentage).toFixed(2)
      : (100 / market.noPercentage).toFixed(2);
    
    addToBetSlip({
      marketId: market.id,
      marketQuestion: market.question,
      selection,
      odds: parseFloat(odds)
    });
  };
  
  return (
    <div
      onClick={() => navigate(`/market/${market.id}`)}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
    >
      {/* Category Badge */}
      <div className="inline-block px-3 py-1 bg-[#2E5CFF]/20 text-[#2E5CFF] rounded-full text-xs mb-3">
        {market.category}
      </div>
      
      {/* Question */}
      <h3 className="text-white mb-4">{market.question}</h3>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00FF94] to-[#00FF94]/80"
          style={{ width: `${market.yesPercentage}%` }}
        />
        <div
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-[#FF0055] to-[#FF0055]/80"
          style={{ width: `${market.noPercentage}%` }}
        />
      </div>
      
      {/* Percentages */}
      <div className="flex justify-between mb-4">
        <span className="text-[#00FF94] font-mono">{market.yesPercentage}% Yes</span>
        <span className="text-[#FF0055] font-mono">{market.noPercentage}% No</span>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={(e) => handleSelection('no', e)}
          className="flex-1 h-12 bg-[#FF0055] hover:bg-[#FF0055]/90 text-white rounded-full transition-all active:scale-95"
        >
          Cap (No)
        </button>
        <button
          onClick={(e) => handleSelection('yes', e)}
          className="flex-1 h-12 bg-[#00FF94] hover:bg-[#00FF94]/90 text-black rounded-full transition-all active:scale-95"
        >
          No Cap (Yes)
        </button>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-gray-400 text-sm">
        <div className="flex items-center gap-1">
          <MessageCircle size={16} />
          <span>{market.commentCount}</span>
        </div>
        <span>₵{(market.totalVolume / 1000).toFixed(0)}k volume</span>
      </div>
    </div>
  );
};
