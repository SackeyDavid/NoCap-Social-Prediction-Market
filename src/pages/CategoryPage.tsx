import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { MarketCard } from '../components/MarketCard';
import { mockMarkets, categories } from '../data/mockData';
import { ArrowLeft, Filter } from 'lucide-react';

export const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'settled'>('all');
  
  const category = categories.find(c => c.id === categoryId);
  const filteredMarkets = mockMarkets.filter(m => 
    m.category.toLowerCase() === category?.name.toLowerCase() &&
    (filter === 'all' || m.status === filter)
  );
  
  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-30">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => navigate('/explore')}
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category?.icon}</span>
              <h2 className="text-white">{category?.name}</h2>
            </div>
          </div>
          
          <button className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <Filter size={20} className="text-white" />
          </button>
        </div>
        
        {/* Filter Chips */}
        <div className="flex gap-2 px-6 pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-[#00FF94] text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              filter === 'active'
                ? 'bg-[#00FF94] text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('settled')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              filter === 'settled'
                ? 'bg-[#00FF94] text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Settled
          </button>
        </div>
      </div>
      
      {/* Markets */}
      <div className="px-6 mt-6">
        {filteredMarkets.length > 0 ? (
          <div className="space-y-4">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No markets found</p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};
