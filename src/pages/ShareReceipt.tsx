import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Share2, Download, Home } from 'lucide-react';
import { Button } from '../components/Button';
import { Bet } from '../types';

export const ShareReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bet = location.state?.bet as Bet;
  
  if (!bet) {
    navigate('/home');
    return null;
  }
  
  const handleShare = () => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: 'NoCap Bet Receipt',
        text: `I just placed a bet on NoCap! Potential payout: ₵${bet.potentialPayout.toFixed(2)} 🔥`,
        url: window.location.href
      }).catch(() => {});
    } else {
      alert('Share functionality not available');
    }
  };
  
  return (
    <div className="min-h-screen bg-[#050505] p-6 flex flex-col items-center justify-center">
      {/* Receipt Card */}
      <div className="w-full max-w-sm mb-8 relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94] via-[#2E5CFF] to-[#FF0055] rounded-3xl blur-2xl opacity-30" />
        
        <div className="relative bg-[#0A0A0A] rounded-3xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#00FF94]/20 via-[#2E5CFF]/20 to-[#FF0055]/20 p-6 text-center border-b border-white/10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00FF94] to-[#2E5CFF] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
              ⚡
            </div>
            <h2 className="text-white mb-1">Bet Placed!</h2>
            <p className="text-gray-400 text-sm">
              {new Date(bet.createdAt).toLocaleString()}
            </p>
          </div>
          
          {/* Bet Details */}
          <div className="p-6 space-y-4">
            {bet.legs.map((leg, index) => (
              <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-white text-sm mb-2">{leg.marketQuestion}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    leg.selection === 'yes'
                      ? 'bg-[#00FF94]/20 text-[#00FF94]'
                      : 'bg-[#FF0055]/20 text-[#FF0055]'
                  }`}>
                    {leg.selection === 'yes' ? 'No Cap (Yes)' : 'Cap (No)'}
                  </span>
                  <span className="text-white font-mono text-sm">{leg.odds.toFixed(2)}x</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="px-6 pb-6 space-y-3">
            <div className="h-px bg-white/10" />
            
            <div className="flex justify-between">
              <span className="text-gray-400">Stake</span>
              <span className="text-white font-mono">₵{bet.stake.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Total Odds</span>
              <span className="text-white font-mono">{bet.totalOdds.toFixed(2)}x</span>
            </div>
            
            <div className="h-px bg-white/10" />
            
            <div className="flex justify-between items-center">
              <span className="text-white">Potential Payout</span>
              <span className="text-[#00FF94] font-mono">
                ₵{bet.potentialPayout.toFixed(2)}
              </span>
            </div>
          </div>
          
          {/* QR Code Placeholder */}
          <div className="px-6 pb-6">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <div className="w-32 h-32 bg-white/10 rounded-xl mx-auto mb-2 flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
              <p className="text-gray-400 text-xs">Scan to view on NoCap</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="w-full max-w-sm space-y-3">
        <Button
          onClick={handleShare}
          variant="primary"
          size="lg"
          fullWidth
          icon={<Share2 size={20} />}
        >
          Share to WhatsApp
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          icon={<Download size={20} />}
        >
          Download Receipt
        </Button>
        
        <Button
          onClick={() => navigate('/home')}
          variant="ghost"
          size="lg"
          fullWidth
          icon={<Home size={20} />}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};
