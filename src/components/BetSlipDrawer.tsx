import React, { useState } from 'react';
import { X, Trash2, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export const BetSlipDrawer = () => {
  const { betSlip, removeFromBetSlip, isBetSlipOpen, setIsBetSlipOpen, placeBet, user } = useApp();
  const [stake, setStake] = useState('');
  const navigate = useNavigate();
  
  if (!isBetSlipOpen) return null;
  
  const totalOdds = betSlip.length > 0 
    ? betSlip.reduce((acc, leg) => acc * leg.odds, 1)
    : 0;
  
  const potentialPayout = stake ? parseFloat(stake) * totalOdds : 0;
  
  const handlePlaceBet = () => {
    if (!stake || parseFloat(stake) <= 0 || !user) return;
    
    const stakeAmount = parseFloat(stake);
    if (stakeAmount > user.balance) {
      alert('Insufficient balance! Please deposit funds.');
      return;
    }
    
    const bet = placeBet(stakeAmount);
    navigate('/share-receipt', { state: { bet } });
  };
  
  const addQuickStake = (amount: number) => {
    const currentStake = parseFloat(stake) || 0;
    setStake((currentStake + amount).toString());
  };
  
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={() => setIsBetSlipOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] rounded-t-3xl z-50 max-w-md mx-auto animate-slide-up border-t border-white/10">
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white">Bet Slip</h2>
            <button
              onClick={() => setIsBetSlipOpen(false)}
              className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
          
          {betSlip.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Your bet slip is empty</p>
              <p className="text-gray-500 text-sm mt-2">Add predictions to get started</p>
            </div>
          ) : (
            <>
              {/* Bet Legs */}
              <div className="space-y-3 mb-6">
                {betSlip.map((leg) => (
                  <div
                    key={leg.marketId}
                    className="bg-white/5 rounded-2xl p-4 border border-white/10"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-white text-sm flex-1">{leg.marketQuestion}</p>
                      <button
                        onClick={() => removeFromBetSlip(leg.marketId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        leg.selection === 'yes'
                          ? 'bg-[#00FF94]/20 text-[#00FF94]'
                          : 'bg-[#FF0055]/20 text-[#FF0055]'
                      }`}>
                        {leg.selection === 'yes' ? 'No Cap (Yes)' : 'Cap (No)'}
                      </span>
                      <span className="text-white font-mono">{leg.odds.toFixed(2)}x</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Stake Input */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Stake Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white">₵</span>
                  <input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-14 pl-10 pr-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00FF94] transition-colors"
                  />
                </div>
              </div>
              
              {/* Quick Add Buttons */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => addQuickStake(5)}
                  className="flex-1 h-10 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  +5
                </button>
                <button
                  onClick={() => addQuickStake(10)}
                  className="flex-1 h-10 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  +10
                </button>
                <button
                  onClick={() => addQuickStake(20)}
                  className="flex-1 h-10 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  +20
                </button>
              </div>
              
              {/* Summary */}
              <div className="bg-white/5 rounded-2xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Total Odds</span>
                  <span className="text-white font-mono">{totalOdds.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Potential Payout</span>
                  <span className="text-[#00FF94] font-mono">
                    ₵{potentialPayout.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Place Bet Button */}
              <Button
                onClick={handlePlaceBet}
                variant="primary"
                size="lg"
                fullWidth
                disabled={!stake || parseFloat(stake) <= 0}
              >
                Place Bet
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
