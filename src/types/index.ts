export interface Market {
  id: string;
  category: string;
  question: string;
  yesPercentage: number;
  noPercentage: number;
  image?: string;
  endDate: string;
  totalVolume: number;
  commentCount: number;
  status: 'active' | 'settled';
  result?: 'yes' | 'no';
}

export interface BetLeg {
  marketId: string;
  marketQuestion: string;
  selection: 'yes' | 'no';
  odds: number;
}

export interface Bet {
  id: string;
  legs: BetLeg[];
  stake: number;
  totalOdds: number;
  potentialPayout: number;
  status: 'pending' | 'won' | 'lost';
  createdAt: string;
  settledAt?: string;
  actualPayout?: number;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  balance: number;
  rank: number;
  accuracy: number;
  totalBets: number;
  biggestWin: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'bet_placed' | 'bet_won';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: string;
}
