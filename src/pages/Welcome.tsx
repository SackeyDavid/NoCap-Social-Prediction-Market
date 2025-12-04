import React from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Zap } from 'lucide-react';

export const Welcome = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050505] via-[#0A0A0A] to-[#050505] flex flex-col items-center justify-between p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00FF94]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF0055]/10 rounded-full blur-[120px]" />
      
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Logo */}
        <div className="mb-8 animate-pulse">
          <div className="w-24 h-24 bg-gradient-to-br from-[#00FF94] to-[#2E5CFF] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(0,255,148,0.3)]">
            <Zap size={48} className="text-black" />
          </div>
        </div>
        
        {/* App Name */}
        <h1 className="text-white mb-3 text-center">
          <span className="bg-gradient-to-r from-[#00FF94] via-[#2E5CFF] to-[#FF0055] bg-clip-text text-transparent">
            NoCap
          </span>
        </h1>
        
        {/* Tagline */}
        <p className="text-gray-400 text-center mb-12">
          Bet the Vibes. Predict the Culture.
        </p>
        
        {/* Features */}
        <div className="space-y-4 mb-12 w-full max-w-sm">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            <div className="w-10 h-10 bg-[#00FF94]/20 rounded-full flex items-center justify-center">
              <TrendingUp size={20} className="text-[#00FF94]" />
            </div>
            <div>
              <p className="text-white">Predict Culture</p>
              <small className="text-gray-400">Music, Politics, Sports & More</small>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            <div className="w-10 h-10 bg-[#FF0055]/20 rounded-full flex items-center justify-center">
              <Zap size={20} className="text-[#FF0055]" />
            </div>
            <div>
              <p className="text-white">Win Real Money</p>
              <small className="text-gray-400">Cash out with MoMo instantly</small>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTAs */}
      <div className="w-full space-y-3 relative z-10">
        <Button
          onClick={() => navigate('/login')}
          variant="primary"
          size="lg"
          fullWidth
        >
          Enter the Streets
        </Button>
        <Button
          onClick={() => navigate('/design-system')}
          variant="ghost"
          size="lg"
          fullWidth
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};
