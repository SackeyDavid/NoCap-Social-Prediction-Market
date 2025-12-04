import React from 'react';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine, Receipt } from 'lucide-react';
import { mockTransactions } from '../data/mockData';

export const Wallet = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine size={20} className="text-[#00FF94]" />;
      case 'withdraw':
        return <ArrowUpFromLine size={20} className="text-[#FF0055]" />;
      case 'bet_placed':
        return <Receipt size={20} className="text-[#2E5CFF]" />;
      case 'bet_won':
        return <Receipt size={20} className="text-[#00FF94]" />;
      default:
        return null;
    }
  };
  
  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdraw':
        return 'Withdrawal';
      case 'bet_placed':
        return 'Bet Placed';
      case 'bet_won':
        return 'Bet Won';
      default:
        return type;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-30 px-6 py-4">
        <h2 className="text-white">Wallet</h2>
      </div>
      
      <div className="px-6 mt-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#00FF94]/20 via-[#2E5CFF]/20 to-[#FF0055]/20 rounded-3xl p-8 mb-6 border border-white/10 backdrop-blur-xl">
          <p className="text-gray-400 mb-2">Available Balance</p>
          <h1 className="text-white mb-6">
            <span className="font-mono">₵{user?.balance.toFixed(2)}</span>
          </h1>
          
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/deposit')}
              variant="primary"
              size="md"
              fullWidth
              icon={<ArrowDownToLine size={20} />}
            >
              Deposit
            </Button>
            <Button
              onClick={() => navigate('/withdraw')}
              variant="secondary"
              size="md"
              fullWidth
              icon={<ArrowUpFromLine size={20} />}
            >
              Withdraw
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            <p className="text-gray-400 text-xs mb-1">Win Rate</p>
            <p className="text-white">{user?.accuracy.toFixed(1)}%</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            <p className="text-gray-400 text-xs mb-1">Total Bets</p>
            <p className="text-white">{user?.totalBets}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            <p className="text-gray-400 text-xs mb-1">Biggest Win</p>
            <p className="text-white">₵{user?.biggestWin}</p>
          </div>
        </div>
        
        {/* Transaction History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Recent Transactions</h3>
            <button
              onClick={() => navigate('/transactions')}
              className="text-[#00FF94] text-sm hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-2">
            {mockTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-white text-sm">{getTransactionLabel(transaction.type)}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono ${
                    transaction.amount > 0 ? 'text-[#00FF94]' : 'text-white'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}₵{Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-xs capitalize">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};
