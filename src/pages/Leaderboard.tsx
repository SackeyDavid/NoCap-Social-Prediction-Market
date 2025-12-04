import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Medal, Award } from 'lucide-react';
import { leaderboardData } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} className="text-yellow-500" />;
    if (rank === 2) return <Medal size={20} className="text-gray-400" />;
    if (rank === 3) return <Award size={20} className="text-orange-600" />;
    return null;
  };
  
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30';
    if (rank === 2) return 'from-gray-400/20 to-gray-400/5 border-gray-400/30';
    if (rank === 3) return 'from-orange-600/20 to-orange-600/5 border-orange-600/30';
    return 'from-white/5 to-transparent border-white/10';
  };
  
  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-30">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h2 className="text-white">Leaderboard</h2>
        </div>
        
        <div className="px-6 pb-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Weekly Rankings</p>
            <p className="text-white">Top predictors this week</p>
          </div>
        </div>
      </div>
      
      {/* Podium */}
      <div className="px-6 py-8">
        <div className="flex items-end justify-center gap-2 mb-8">
          {/* 2nd Place */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2">
              {leaderboardData[1].avatar}
            </div>
            <p className="text-white text-sm mb-1">{leaderboardData[1].username}</p>
            <p className="text-gray-400 text-xs mb-2">{leaderboardData[1].score}</p>
            <div className="h-24 bg-gradient-to-t from-gray-400/20 to-gray-400/5 rounded-t-2xl border-t-2 border-gray-400 flex items-center justify-center">
              <span className="text-gray-400 text-xl">2</span>
            </div>
          </div>
          
          {/* 1st Place */}
          <div className="flex-1 text-center">
            <Crown size={24} className="text-yellow-500 mx-auto mb-2" />
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-2">
              {leaderboardData[0].avatar}
            </div>
            <p className="text-white mb-1">{leaderboardData[0].username}</p>
            <p className="text-yellow-500 font-mono mb-2">{leaderboardData[0].score}</p>
            <div className="h-32 bg-gradient-to-t from-yellow-500/20 to-yellow-500/5 rounded-t-2xl border-t-2 border-yellow-500 flex items-center justify-center">
              <span className="text-yellow-500 text-2xl">1</span>
            </div>
          </div>
          
          {/* 3rd Place */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2">
              {leaderboardData[2].avatar}
            </div>
            <p className="text-white text-sm mb-1">{leaderboardData[2].username}</p>
            <p className="text-gray-400 text-xs mb-2">{leaderboardData[2].score}</p>
            <div className="h-16 bg-gradient-to-t from-orange-600/20 to-orange-600/5 rounded-t-2xl border-t-2 border-orange-600 flex items-center justify-center">
              <span className="text-orange-600 text-xl">3</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rest of Rankings */}
      <div className="px-6 pb-6">
        <div className="space-y-2">
          {leaderboardData.slice(3).map((player) => (
            <div
              key={player.rank}
              className={`bg-gradient-to-r ${getRankColor(player.rank)} backdrop-blur-xl rounded-2xl p-4 border ${
                player.username === user?.username ? 'ring-2 ring-[#00FF94]' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-center">
                  {getRankIcon(player.rank) || (
                    <span className="text-gray-400">#{player.rank}</span>
                  )}
                </div>
                
                <div className="w-12 h-12 bg-gradient-to-br from-[#00FF94] to-[#2E5CFF] rounded-full flex items-center justify-center text-xl">
                  {player.avatar}
                </div>
                
                <div className="flex-1">
                  <p className="text-white">{player.username}</p>
                  <p className="text-gray-400 text-sm">{player.winRate.toFixed(1)}% win rate</p>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-mono">{player.score}</p>
                  <p className="text-gray-400 text-xs">points</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
