import React from 'react';
import { Home, Search, Receipt, Wallet, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Receipt, label: 'My Bets', path: '/my-bets' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-white/10 backdrop-blur-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-20 px-4">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <Icon
              size={24}
              strokeWidth={2}
              className={`transition-colors ${
                isActive(path) ? 'text-[#00FF94]' : 'text-gray-500'
              }`}
            />
            <span className={`text-xs transition-colors ${
              isActive(path) ? 'text-[#00FF94]' : 'text-gray-500'
            }`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
