import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, Receipt } from 'lucide-react';
import { mockTransactions } from '../data/mockData';

export const TransactionHistory = () => {
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
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-30">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => navigate('/wallet')}
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h2 className="text-white">Transaction History</h2>
        </div>
      </div>
      
      <div className="px-6 py-6">
        <div className="space-y-2">
          {mockTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-white text-sm">{getTransactionLabel(transaction.type)}</p>
                    {transaction.method && (
                      <p className="text-gray-400 text-xs">{transaction.method}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono ${
                    transaction.amount > 0 ? 'text-[#00FF94]' : 'text-white'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}₵{Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {new Date(transaction.date).toLocaleString()}
                </span>
                <span className={`capitalize ${
                  transaction.status === 'completed' ? 'text-[#00FF94]' :
                  transaction.status === 'pending' ? 'text-yellow-500' :
                  'text-[#FF0055]'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
