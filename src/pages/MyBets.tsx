import React, { useState } from 'react';
import { BottomNav } from '../components/BottomNav';
import { mockBets } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export const MyBets = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'settled'>('active');
  const navigate = useNavigate();
  
  const filteredBets = mockBets.filter(bet => 
    activeTab === 'active' ? bet.status === 'pending' : bet.status !== 'pending'
  );
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="text-yellow-500" />;
      case 'won':
        return <CheckCircle2 size={20} className="text-[#00FF94]" />;
      case 'lost':
        return <XCircle size={20} className="text-[#FF0055]" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'won':
        return 'border-[#00FF94]/20 bg-[#00FF94]/5';
      case 'lost':
        return 'border-[#FF0055]/20 bg-[#FF0055]/5';
      default:
        return '';
    }
  };
  
  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-30 px-6 py-4">
        <h2 className="text-white mb-4">My Bets</h2>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 h-12 rounded-full transition-all ${
              activeTab === 'active'
                ? 'bg-[#00FF94] text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('settled')}
            className={`flex-1 h-12 rounded-full transition-all ${
              activeTab === 'settled'
                ? 'bg-[#00FF94] text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Settled
          </button>
        </div>
      </div>
      
      {/* Bets List */}
      <div className="px-6 mt-6 space-y-4">
        {filteredBets.length > 0 ? (
          filteredBets.map((bet) => (
            <div
              key={bet.id}
              onClick={() => navigate(`/bet/${bet.id}`)}
              className={`bg-white/5 backdrop-blur-xl rounded-3xl p-5 border cursor-pointer hover:border-white/20 transition-all ${getStatusColor(bet.status)}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(bet.status)}
                  <span className="text-white capitalize">{bet.status}</span>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(bet.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {/* Bet Legs */}
              <div className="space-y-2 mb-4">
                {bet.legs.map((leg, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 ${
                      leg.selection === 'yes' ? 'bg-[#00FF94]' : 'bg-[#FF0055]'
                    }`} />
                    <div className="flex-1">
                      <p className="text-white text-sm">{leg.marketQuestion}</p>
                      <p className="text-gray-400 text-xs">
                        {leg.selection === 'yes' ? 'No Cap (Yes)' : 'Cap (No)'} @ {leg.odds.toFixed(2)}x
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-gray-400 text-sm">Stake</p>
                  <p className="text-white font-mono">₵{bet.stake.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Odds</p>
                  <p className="text-white font-mono">{bet.totalOdds.toFixed(2)}x</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">
                    {bet.status === 'pending' ? 'Potential' : 'Payout'}
                  </p>
                  <p className={`font-mono ${
                    bet.status === 'won' ? 'text-[#00FF94]' : 
                    bet.status === 'lost' ? 'text-[#FF0055]' : 'text-white'
                  }`}>
                    ₵{(bet.actualPayout || bet.potentialPayout).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No {activeTab} bets</p>
            <p className="text-gray-500 text-sm mt-2">
              {activeTab === 'active' 
                ? 'Place a bet to see it here' 
                : 'Settled bets will appear here'}
            </p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};
