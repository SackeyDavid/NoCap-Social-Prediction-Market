import React from 'react';
import { BottomNav } from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Settings, Trophy, Crown } from 'lucide-react';

export const Profile = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-30 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white">Profile</h2>
          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <Settings size={20} className="text-white" />
          </button>
        </div>
      </div>
      
      <div className="px-6 mt-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-[#00FF94]/20 via-[#2E5CFF]/20 to-[#FF0055]/20 rounded-3xl p-6 mb-6 border border-white/10 backdrop-blur-xl text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-[#00FF94] to-[#2E5CFF] rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            {user?.avatar}
          </div>
          
          <h2 className="text-white mb-2">{user?.username}</h2>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full mb-4">
            <Crown size={16} className="text-yellow-500" />
            <span className="text-yellow-500">Rank #{user?.rank}</span>
          </div>
          
          <button
            onClick={() => navigate('/edit-profile')}
            className="w-full h-12 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            Edit Profile
          </button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-[#00FF94]">{user?.accuracy.toFixed(1)}%</p>
            <p className="text-gray-400 text-xs mt-1">Accuracy</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-white">{user?.totalBets}</p>
            <p className="text-gray-400 text-xs mt-1">Total Bets</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-white">₵{user?.biggestWin}</p>
            <p className="text-gray-400 text-xs mt-1">Biggest Win</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full h-16 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Trophy size={20} className="text-yellow-500" />
              </div>
              <span className="text-white">Leaderboard</span>
            </div>
            <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className="w-full h-16 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Settings size={20} className="text-white" />
              </div>
              <span className="text-white">Settings</span>
            </div>
            <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
          </button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};
