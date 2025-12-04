import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';

export const WithdrawSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount || 0;
  
  return (
    <div className="min-h-screen bg-[#050505] p-6 flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-[#00FF94]/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <CheckCircle2 size={48} className="text-[#00FF94]" />
      </div>
      
      <h2 className="text-white mb-3 text-center">Withdrawal Successful!</h2>
      
      <p className="text-gray-400 text-center mb-8">
        ₵{amount.toFixed(2)} is on its way to your mobile money account
      </p>
      
      <div className="w-full space-y-3">
        <Button
          onClick={() => navigate('/wallet')}
          variant="primary"
          size="lg"
          fullWidth
        >
          View Wallet
        </Button>
        <Button
          onClick={() => navigate('/home')}
          variant="ghost"
          size="lg"
          fullWidth
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};
