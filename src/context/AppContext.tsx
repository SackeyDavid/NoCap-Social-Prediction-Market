import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, BetLeg, Bet, Market } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  betSlip: BetLeg[];
  addToBetSlip: (leg: BetLeg) => void;
  removeFromBetSlip: (marketId: string) => void;
  clearBetSlip: () => void;
  isBetSlipOpen: boolean;
  setIsBetSlipOpen: (open: boolean) => void;
  placeBet: (stake: number) => Bet;
  updateBalance: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children?: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    username: 'VibeMaster',
    avatar: '👑',
    balance: 450.00,
    rank: 12,
    accuracy: 68.5,
    totalBets: 147,
    biggestWin: 1250.00
  });

  const [betSlip, setBetSlip] = useState<BetLeg[]>([]);
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);

  const addToBetSlip = (leg: BetLeg) => {
    setBetSlip(prev => {
      const exists = prev.find(l => l.marketId === leg.marketId);
      if (exists) {
        return prev.map(l => l.marketId === leg.marketId ? leg : l);
      }
      return [...prev, leg];
    });
    setIsBetSlipOpen(true);
  };

  const removeFromBetSlip = (marketId: string) => {
    setBetSlip(prev => prev.filter(l => l.marketId !== marketId));
  };

  const clearBetSlip = () => {
    setBetSlip([]);
  };

  const placeBet = (stake: number): Bet => {
    const totalOdds = betSlip.reduce((acc, leg) => acc * leg.odds, 1);
    const potentialPayout = stake * totalOdds;
    
    const bet: Bet = {
      id: Date.now().toString(),
      legs: [...betSlip],
      stake,
      totalOdds,
      potentialPayout,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (user) {
      setUser({ ...user, balance: user.balance - stake });
    }

    clearBetSlip();
    setIsBetSlipOpen(false);
    
    return bet;
  };

  const updateBalance = (amount: number) => {
    if (user) {
      setUser({ ...user, balance: user.balance + amount });
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      betSlip,
      addToBetSlip,
      removeFromBetSlip,
      clearBetSlip,
      isBetSlipOpen,
      setIsBetSlipOpen,
      placeBet,
      updateBalance
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
