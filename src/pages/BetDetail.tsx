import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { mockBets } from '../data/mockData';

export const BetDetail = () => {
  const { betId } = useParams();
  const navigate = useNavigate();
  
  const bet = mockBets.find(b => b.id === betId);
  
  if (!bet) {
    return <div>Bet not found</div>;
  }
  
  const getStatusIcon = () => {
    switch (bet.status) {
      case 'pending':
        return <Clock size={32} className="text-yellow-500" />;
      case 'won':
        return <CheckCircle2 size={32} className="text-[#00FF94]" />;
      case 'lost':
        return <XCircle size={32} className="text-[#FF0055]" />;
    }
  };
  
  const getStatusColor = () => {
    switch (bet.status) {
      case 'pending':
        return 'from-yellow-500/20 to-yellow-500/5';
      case 'won':
        return 'from-[#00FF94]/20 to-[#00FF94]/5';
      case 'lost':
        return 'from-[#FF0055]/20 to-[#FF0055]/5';
      default:
        return '';
    }
  };
  
  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-30">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => navigate('/my-bets')}
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h2 className="text-white">Bet Details</h2>
        </div>
      </div>
      
      <div className="px-6 py-6">
        {/* Status Card */}
        <div className={`bg-gradient-to-br ${getStatusColor()} rounded-3xl p-6 border border-white/10 mb-6 text-center`}>
          <div className="flex justify-center mb-3">
            {getStatusIcon()}
          </div>
          <h3 className="text-white capitalize mb-2">{bet.status}</h3>
          <p className="text-gray-400 text-sm">
            {new Date(bet.createdAt).toLocaleString()}
          </p>
        </div>
        
        {/* Bet Legs */}
        <div className="mb-6">
          <h3 className="text-white mb-4">Predictions</h3>
          <div className="space-y-3">
            {bet.legs.map((leg, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
              >
                <p className="text-white mb-3">{leg.marketQuestion}</p>
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
        </div>
        
        {/* Summary */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Stake</span>
            <span className="text-white font-mono">₵{bet.stake.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Odds</span>
            <span className="text-white font-mono">{bet.totalOdds.toFixed(2)}x</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex justify-between">
            <span className="text-gray-400">
              {bet.status === 'pending' ? 'Potential Payout' : 'Final Payout'}
            </span>
            <span className={`font-mono ${
              bet.status === 'won' ? 'text-[#00FF94]' : 
              bet.status === 'lost' ? 'text-[#FF0055]' : 'text-white'
            }`}>
              ₵{(bet.actualPayout || bet.potentialPayout).toFixed(2)}
            </span>
          </div>
        </div>
        
        {bet.settledAt && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Settled on {new Date(bet.settledAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
