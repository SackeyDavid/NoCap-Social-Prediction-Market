import React, { useState } from 'react';
import { BottomNav } from '../components/BottomNav';
import { Search, TrendingUp } from 'lucide-react';
import { trendingHashtags, categories } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-30 px-6 py-4">
        <h2 className="text-white mb-4">Explore</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white/5 border-2 border-white/10 rounded-full text-white placeholder:text-gray-400 focus:outline-none focus:border-[#00FF94] transition-colors"
          />
        </div>
      </div>
      
      <div className="px-6 mt-6">
        {/* Trending Hashtags */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-[#00FF94]" />
            <h3 className="text-white">Trending</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {trendingHashtags.map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:bg-white/10 hover:border-[#00FF94] hover:text-[#00FF94] transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Categories Grid */}
        <div>
          <h3 className="text-white mb-4">Categories</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/category/${category.id}`)}
                className="h-32 rounded-3xl p-5 flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${category.color}20, ${category.color}05)`
                }}
              >
                <span className="text-4xl">{category.icon}</span>
                <div>
                  <p className="text-white">{category.name}</p>
                  <small className="text-gray-400">Explore markets</small>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};
