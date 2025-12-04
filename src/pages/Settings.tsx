import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

export const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    betUpdates: true,
    marketAlerts: true,
    promotions: false
  });
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/');
    }
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
          <h2 className="text-white">Settings</h2>
        </div>
      </div>
      
      <div className="px-6 py-6">
        {/* Notifications */}
        <div className="mb-8">
          <h3 className="text-white mb-4">Notifications</h3>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <label className="flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-400" />
                <div>
                  <p className="text-white">Bet Updates</p>
                  <p className="text-gray-400 text-sm">Get notified when bets settle</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.betUpdates}
                onChange={(e) => setNotifications({...notifications, betUpdates: e.target.checked})}
                className="w-12 h-6 bg-white/10 rounded-full appearance-none cursor-pointer relative checked:bg-[#00FF94] transition-colors"
              />
            </label>
            
            <div className="h-px bg-white/10" />
            
            <label className="flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-400" />
                <div>
                  <p className="text-white">Market Alerts</p>
                  <p className="text-gray-400 text-sm">New trending markets</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.marketAlerts}
                onChange={(e) => setNotifications({...notifications, marketAlerts: e.target.checked})}
                className="w-12 h-6 bg-white/10 rounded-full appearance-none cursor-pointer relative checked:bg-[#00FF94] transition-colors"
              />
            </label>
            
            <div className="h-px bg-white/10" />
            
            <label className="flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-400" />
                <div>
                  <p className="text-white">Promotions</p>
                  <p className="text-gray-400 text-sm">Special offers and bonuses</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.promotions}
                onChange={(e) => setNotifications({...notifications, promotions: e.target.checked})}
                className="w-12 h-6 bg-white/10 rounded-full appearance-none cursor-pointer relative checked:bg-[#00FF94] transition-colors"
              />
            </label>
          </div>
        </div>
        
        {/* Account */}
        <div className="mb-8">
          <h3 className="text-white mb-4">Account</h3>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-gray-400" />
                <span className="text-white">Payment Methods</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            
            <div className="h-px bg-white/10" />
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-gray-400" />
                <span className="text-white">Security</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Support */}
        <div className="mb-8">
          <h3 className="text-white mb-4">Support</h3>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-gray-400" />
                <span className="text-white">Help Center</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full h-14 bg-[#FF0055]/10 border border-[#FF0055]/20 rounded-2xl text-[#FF0055] flex items-center justify-center gap-2 hover:bg-[#FF0055]/20 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};
