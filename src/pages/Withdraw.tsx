import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useApp } from '../context/AppContext';

const paymentMethods = [
  { id: 'mtn', name: 'MTN MoMo', icon: '📱', color: '#FFCC00' },
  { id: 'telecel', name: 'Telecel Cash', icon: '📞', color: '#FF0000' },
  { id: 'at', name: 'AT Money', icon: '📲', color: '#FF6600' }
];

export const Withdraw = () => {
  const navigate = useNavigate();
  const { user, updateBalance } = useApp();
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  
  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0 || !user) return;
    
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > user.balance) {
      alert('Insufficient balance!');
      return;
    }
    
    // Mock withdrawal success
    updateBalance(-withdrawAmount);
    navigate('/withdraw-success', { state: { amount: withdrawAmount } });
  };
  
  return (
    <div className="min-h-screen bg-[#050505] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/wallet')}
          className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="text-white">Withdraw Funds</h2>
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Balance Info */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 mb-6">
            <p className="text-gray-400 text-sm">Available Balance</p>
            <p className="text-white font-mono">₵{user?.balance.toFixed(2)}</p>
          </div>
          
          {/* Payment Methods */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-3 block">Withdrawal Method</label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full h-16 rounded-2xl p-4 flex items-center gap-3 transition-all ${
                    selectedMethod === method.id
                      ? 'bg-white/10 border-2 border-[#00FF94]'
                      : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${method.color}20` }}
                  >
                    {method.icon}
                  </div>
                  <span className="text-white">{method.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Amount */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white">₵</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                max={user?.balance}
                className="w-full h-14 pl-10 pr-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00FF94] transition-colors"
              />
            </div>
          </div>
          
          {/* Phone Number */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-2 block">Phone Number</label>
            <Input
              type="tel"
              placeholder="024 123 4567"
              value={phone}
              onChange={setPhone}
              icon={<Phone size={20} />}
            />
          </div>
          
          {/* Info */}
          <div className="bg-[#FF0055]/10 border border-[#FF0055]/20 rounded-2xl p-4">
            <p className="text-[#FF0055] text-sm">
              Withdrawals are processed instantly. Funds will be sent to your mobile money account.
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleWithdraw}
          variant="secondary"
          size="lg"
          fullWidth
          disabled={!amount || parseFloat(amount) <= 0 || phone.length < 10}
        >
          Cash Out ₵{amount || '0.00'}
        </Button>
      </div>
    </div>
  );
};
