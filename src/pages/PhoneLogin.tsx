import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';

export const PhoneLogin = () => {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#050505] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="text-white">Enter Phone Number</h2>
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-gray-400 mb-8">
            We'll send you an OTP to verify your number
          </p>
          
          <Input
            type="tel"
            placeholder="024 123 4567"
            value={phone}
            onChange={setPhone}
            icon={<Phone size={20} />}
          />
          
          {/* Provider Icons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-2">
                <span className="text-2xl">📱</span>
              </div>
              <small className="text-gray-400">MTN</small>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center mb-2">
                <span className="text-2xl">📞</span>
              </div>
              <small className="text-gray-400">Telecel</small>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-2">
                <span className="text-2xl">📲</span>
              </div>
              <small className="text-gray-400">AT</small>
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => navigate('/otp')}
          variant="primary"
          size="lg"
          fullWidth
          disabled={phone.length < 10}
        >
          Send OTP
        </Button>
      </div>
    </div>
  );
};
