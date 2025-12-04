import React from 'react';
import { BottomNav } from '../components/BottomNav';
import { StoryBubbles } from '../components/StoryBubbles';
import { MarketCard } from '../components/MarketCard';
import { mockMarkets } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Bell } from 'lucide-react';

export const Home = () => {
  const { user } = useApp();
  
  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-30">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00FF94] to-[#2E5CFF] rounded-lg flex items-center justify-center">
              <span className="text-black">⚡</span>
            </div>
            <span className="text-white">NoCap</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative">
              <Bell size={20} className="text-gray-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF0055] rounded-full" />
            </button>
            <div className="bg-white/10 px-4 py-2 rounded-full">
              <span className="text-[#00FF94] font-mono">₵{user?.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Story Bubbles */}
      <div className="mt-6">
        <StoryBubbles />
      </div>
      
      {/* Feed */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">Trending Now</h3>
          <span className="text-gray-400 text-sm">{mockMarkets.length} markets</span>
        </div>
        
        <div className="space-y-4">
          {mockMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};
