import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Welcome } from './pages/Welcome';
import { PhoneLogin } from './pages/PhoneLogin';
import { OTPVerification } from './pages/OTPVerification';
import { CreateProfile } from './pages/CreateProfile';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { CategoryPage } from './pages/CategoryPage';
import { MarketDetail } from './pages/MarketDetail';
import { MyBets } from './pages/MyBets';
import { BetDetail } from './pages/BetDetail';
import { Wallet } from './pages/Wallet';
import { Deposit } from './pages/Deposit';
import { DepositSuccess } from './pages/DepositSuccess';
import { Withdraw } from './pages/Withdraw';
import { WithdrawSuccess } from './pages/WithdrawSuccess';
import { TransactionHistory } from './pages/TransactionHistory';
import { Profile } from './pages/Profile';
import { Leaderboard } from './pages/Leaderboard';
import { Settings } from './pages/Settings';
import { ShareReceipt } from './pages/ShareReceipt';
import { BetSlipDrawer } from './components/BetSlipDrawer';
import { DesignSystem } from './pages/DesignSystem';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-midnight text-white">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<PhoneLogin />} />
            <Route path="/otp" element={<OTPVerification />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/market/:marketId" element={<MarketDetail />} />
            <Route path="/my-bets" element={<MyBets />} />
            <Route path="/bet/:betId" element={<BetDetail />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/deposit-success" element={<DepositSuccess />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/withdraw-success" element={<WithdrawSuccess />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/share-receipt" element={<ShareReceipt />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="*" element={<Welcome />} />
          </Routes>
          <BetSlipDrawer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}