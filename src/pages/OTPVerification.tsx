import React, { useState } from 'react';
import { Button } from '../components/Button';
import { OTPInput } from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#050505] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/login')}
          className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="text-white">Verify OTP</h2>
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-gray-400 mb-8 text-center">
            Enter the 6-digit code sent to<br />
            <span className="text-white">024 123 4567</span>
          </p>
          
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
          />
          
          <div className="text-center mt-6">
            <button className="text-gray-400 text-sm hover:text-[#00FF94] transition-colors">
              Didn't receive code? <span className="text-[#00FF94]">Resend</span>
            </button>
          </div>
        </div>
        
        <Button
          onClick={() => navigate('/create-profile')}
          variant="primary"
          size="lg"
          fullWidth
          disabled={otp.length < 6}
        >
          Verify & Continue
        </Button>
      </div>
    </div>
  );
};
