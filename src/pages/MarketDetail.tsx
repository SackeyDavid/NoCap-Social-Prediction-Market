import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, MessageCircle, BarChart3 } from 'lucide-react';
import { mockMarkets, mockChatMessages } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const priceHistory = [
  { time: '12h', yes: 45, no: 55 },
  { time: '10h', yes: 48, no: 52 },
  { time: '8h', yes: 52, no: 48 },
  { time: '6h', yes: 58, no: 42 },
  { time: '4h', yes: 62, no: 38 },
  { time: '2h', yes: 65, no: 35 },
  { time: 'now', yes: 65, no: 35 }
];

export const MarketDetail = () => {
  const { marketId } = useParams();
  const navigate = useNavigate();
  const { addToBetSlip } = useApp();
  const [activeTab, setActiveTab] = useState<'streets' | 'history' | 'stats'>('streets');
  const [message, setMessage] = useState('');
  
  const market = mockMarkets.find(m => m.id === marketId);
  
  if (!market) {
    return <div>Market not found</div>;
  }
  
  const handleSelection = (selection: 'yes' | 'no') => {
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
    <div className="min-h-screen bg-[#050505] pb-32">
      {/* Header Image */}
      <div className="relative h-48 bg-gradient-to-br from-[#00FF94]/20 via-[#2E5CFF]/20 to-[#FF0055]/20">
        {market.image && (
          <img 
            src={market.image} 
            alt={market.question}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
        
        <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-6">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-lg rounded-full hover:bg-black/70 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          
          <button className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-lg rounded-full hover:bg-black/70 transition-colors">
            <Share2 size={20} className="text-white" />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-6">
          <div className="inline-block px-3 py-1 bg-[#2E5CFF]/80 backdrop-blur-lg text-white rounded-full text-xs mb-4">
            {market.category}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 -mt-6 relative z-10">
        {/* Question Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-6">
          <h2 className="text-white mb-4">{market.question}</h2>
          
          {/* Sentiment Bar */}
          <div className="relative h-3 bg-white/10 rounded-full mb-3 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-[#00FF94]"
              style={{ width: `${market.yesPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between mb-6">
            <span className="text-[#00FF94] font-mono">{market.yesPercentage}% Yes</span>
            <span className="text-[#FF0055] font-mono">{market.noPercentage}% No</span>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 text-sm text-gray-400">
            <div>
              <span className="block text-white">₵{(market.totalVolume / 1000).toFixed(0)}k</span>
              <span>Volume</span>
            </div>
            <div>
              <span className="block text-white">{market.commentCount}</span>
              <span>Comments</span>
            </div>
            <div>
              <span className="block text-white">{market.endDate.split('-')[2]} Dec</span>
              <span>Ends</span>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('streets')}
            className={`flex-1 h-12 rounded-full transition-all ${
              activeTab === 'streets'
                ? 'bg-[#00FF94] text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <MessageCircle size={18} className="inline mr-2" />
            The Streets
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 h-12 rounded-full transition-all ${
              activeTab === 'history'
                ? 'bg-[#00FF94] text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <BarChart3 size={18} className="inline mr-2" />
            History
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 h-12 rounded-full transition-all ${
              activeTab === 'stats'
                ? 'bg-[#00FF94] text-black'
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
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00FF94] to-[#2E5CFF] rounded-full flex items-center justify-center flex-shrink-0">
                    <span>{msg.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm">{msg.username}</span>
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
                  <XAxis dataKey="time" stroke="#B5B5B5" />
                  <YAxis stroke="#B5B5B5" />
                  <Line type="monotone" dataKey="yes" stroke="#00FF94" strokeWidth={2} />
                  <Line type="monotone" dataKey="no" stroke="#FF0055" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Bets</span>
                <span className="text-white">2,456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Average Stake</span>
                <span className="text-white">₵18.34</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Biggest Bet</span>
                <span className="text-white">₵500.00</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-white/10 p-6 max-w-md mx-auto">
        <div className="flex gap-3">
          <Button
            onClick={() => handleSelection('no')}
            variant="pink"
            size="lg"
            fullWidth
          >
            Cap (No) {(100 / market.noPercentage).toFixed(2)}x
          </Button>
          <Button
            onClick={() => handleSelection('yes')}
            variant="primary"
            size="lg"
            fullWidth
          >
            No Cap (Yes) {(100 / market.yesPercentage).toFixed(2)}x
          </Button>
        </div>
      </div>
    </div>
  );
};
