import { Market, Bet, Transaction, ChatMessage } from '../types';

export const mockMarkets: Market[] = [
  {
    id: '1',
    category: 'Music',
    question: 'Will Burna Boy drop a new album before December?',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    yesPercentage: 65,
    noPercentage: 35,
    endDate: '2025-11-30',
    totalVolume: 45000,
    commentCount: 234,
    status: 'active'
  },
  {
    id: '2',
    category: 'Big Brother',
    question: 'BBNaija: Will Khosi win this season?',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80',
    yesPercentage: 42,
    noPercentage: 58,
    endDate: '2025-09-15',
    totalVolume: 128000,
    commentCount: 892,
    status: 'active'
  },
  {
    id: '3',
    category: 'Politics',
    question: 'Will fuel price hit ₵20 per liter this year?',
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80',
    yesPercentage: 78,
    noPercentage: 22,
    endDate: '2025-12-31',
    totalVolume: 67000,
    commentCount: 445,
    status: 'active'
  },
  {
    id: '4',
    category: 'Sports',
    question: 'Will Black Stars qualify for AFCON 2026?',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    yesPercentage: 55,
    noPercentage: 45,
    endDate: '2025-10-30',
    totalVolume: 89000,
    commentCount: 567,
    status: 'active'
  },
  {
    id: '5',
    category: 'Music',
    question: 'Shatta Wale vs Stonebwoy: Who drops first in 2025?',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    yesPercentage: 51,
    noPercentage: 49,
    endDate: '2025-12-31',
    totalVolume: 34000,
    commentCount: 678,
    status: 'active'
  },
  {
    id: '6',
    category: 'Tech',
    question: 'Will Twitter rebrand back from X to Twitter?',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    yesPercentage: 18,
    noPercentage: 82,
    endDate: '2025-12-31',
    totalVolume: 23000,
    commentCount: 156,
    status: 'active'
  },
  {
    id: '7',
    category: 'Entertainment',
    question: 'Will Wizkid perform in Ghana before year end?',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
    yesPercentage: 38,
    noPercentage: 62,
    endDate: '2025-12-31',
    totalVolume: 45000,
    commentCount: 289,
    status: 'active'
  },
  {
    id: '8',
    category: 'Politics',
    question: 'Will Dr. Bawumia become president in 2024 elections?',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    yesPercentage: 47,
    noPercentage: 53,
    endDate: '2024-12-10',
    totalVolume: 156000,
    commentCount: 1234,
    status: 'active'
  }
];

export const mockBets: Bet[] = [
  {
    id: '1',
    legs: [
      {
        marketId: '1',
        marketQuestion: 'Will Burna Boy drop a new album before December?',
        selection: 'yes',
        odds: 1.54
      },
      {
        marketId: '4',
        marketQuestion: 'Will Black Stars qualify for AFCON 2026?',
        selection: 'yes',
        odds: 1.82
      }
    ],
    stake: 50,
    totalOdds: 2.80,
    potentialPayout: 140,
    status: 'pending',
    createdAt: '2025-12-03T10:30:00Z'
  },
  {
    id: '2',
    legs: [
      {
        marketId: '2',
        marketQuestion: 'BBNaija: Will Khosi win this season?',
        selection: 'no',
        odds: 1.72
      }
    ],
    stake: 100,
    totalOdds: 1.72,
    potentialPayout: 172,
    status: 'won',
    createdAt: '2025-11-28T15:20:00Z',
    settledAt: '2025-11-30T20:00:00Z',
    actualPayout: 172
  },
  {
    id: '3',
    legs: [
      {
        marketId: '3',
        marketQuestion: 'Will fuel price hit ₵20 per liter this year?',
        selection: 'yes',
        odds: 1.28
      },
      {
        marketId: '5',
        marketQuestion: 'Shatta Wale vs Stonebwoy: Who drops first in 2025?',
        selection: 'yes',
        odds: 1.96
      },
      {
        marketId: '7',
        marketQuestion: 'Will Wizkid perform in Ghana before year end?',
        selection: 'no',
        odds: 1.61
      }
    ],
    stake: 25,
    totalOdds: 4.03,
    potentialPayout: 100.75,
    status: 'lost',
    createdAt: '2025-11-25T08:15:00Z',
    settledAt: '2025-11-27T18:00:00Z',
    actualPayout: 0
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 200,
    date: '2025-12-04T09:30:00Z',
    status: 'completed',
    method: 'MTN MoMo'
  },
  {
    id: '2',
    type: 'bet_placed',
    amount: -50,
    date: '2025-12-03T10:30:00Z',
    status: 'completed'
  },
  {
    id: '3',
    type: 'bet_won',
    amount: 172,
    date: '2025-11-30T20:00:00Z',
    status: 'completed'
  },
  {
    id: '4',
    type: 'withdraw',
    amount: -100,
    date: '2025-11-29T14:20:00Z',
    status: 'completed',
    method: 'MTN MoMo'
  },
  {
    id: '5',
    type: 'bet_placed',
    amount: -100,
    date: '2025-11-28T15:20:00Z',
    status: 'completed'
  },
  {
    id: '6',
    type: 'deposit',
    amount: 500,
    date: '2025-11-27T11:00:00Z',
    status: 'completed',
    method: 'Telecel Cash'
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '2',
    username: 'AkosuaVibes',
    avatar: '✨',
    message: 'Burna definitely dropping! Mark my words 🔥',
    timestamp: '2 min ago'
  },
  {
    id: '2',
    userId: '3',
    username: 'KojoPredict',
    avatar: '🎯',
    message: 'Nah this be cap. He said 2026',
    timestamp: '5 min ago'
  },
  {
    id: '3',
    userId: '4',
    username: 'AmaGH',
    avatar: '💎',
    message: 'I put my whole balance on YES 😤',
    timestamp: '8 min ago'
  },
  {
    id: '4',
    userId: '5',
    username: 'EfiaDey',
    avatar: '🌟',
    message: 'The streets are saying December for sure',
    timestamp: '12 min ago'
  },
  {
    id: '5',
    userId: '6',
    username: 'KwameTheOracle',
    avatar: '👁️',
    message: 'Trust the process. Album coming soon 🎵',
    timestamp: '15 min ago'
  }
];

export const categories = [
  { id: 'music', name: 'Music', icon: '🎵', color: '#00FF94' },
  { id: 'big-brother', name: 'Big Brother', icon: '📺', color: '#FF0055' },
  { id: 'politics', name: 'Politics', icon: '🏛️', color: '#2E5CFF' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#FFD700' },
  { id: 'tech', name: 'Tech', icon: '💻', color: '#00FFFF' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#FF00FF' }
];

export const trendingHashtags = [
  '#BBNaija',
  '#ShattaVsStone',
  '#FuelPrice',
  '#BlackStars',
  '#BurnaBoyComing',
  '#ElectionVibes',
  '#WizkidLive'
];

export const leaderboardData = [
  { rank: 1, username: 'PredictKing', avatar: '👑', score: 2450, winRate: 85.2 },
  { rank: 2, username: 'QueenOfOdds', avatar: '👸', score: 2380, winRate: 82.7 },
  { rank: 3, username: 'VibeChecker', avatar: '✨', score: 2210, winRate: 80.1 },
  { rank: 4, username: 'AccraOracle', avatar: '🔮', score: 2050, winRate: 78.9 },
  { rank: 5, username: 'StreetsKnow', avatar: '🎯', score: 1920, winRate: 76.5 },
  { rank: 6, username: 'CultureVulture', avatar: '🦅', score: 1850, winRate: 75.3 },
  { rank: 7, username: 'BetMaster', avatar: '💎', score: 1780, winRate: 74.1 },
  { rank: 8, username: 'NoCapper', avatar: '🚫', score: 1690, winRate: 72.8 },
  { rank: 9, username: 'TrendSetter', avatar: '🌟', score: 1620, winRate: 71.5 },
  { rank: 10, username: 'GhanaPredict', avatar: '🇬🇭', score: 1550, winRate: 70.2 },
  { rank: 11, username: 'LagosBets', avatar: '🌊', score: 1480, winRate: 69.8 },
  { rank: 12, username: 'VibeMaster', avatar: '👑', score: 1420, winRate: 68.5 },
  { rank: 13, username: 'CapDetector', avatar: '🕵️', score: 1350, winRate: 67.3 }
];
