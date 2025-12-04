import React, { useState } from 'react';
import {
  ArrowLeft,
  Palette,
  Type,
  LayoutGrid,
  Sparkles,
  Share2,
  Home,
  Search,
  Receipt,
  Wallet,
  User,
  MessageCircle,
  Zap,
  Gauge,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input, OTPInput } from '../components/Input';
import { MarketCard } from '../components/MarketCard';
import { StoryBubbles } from '../components/StoryBubbles';
import { mockBets, mockChatMessages, mockMarkets, trendingHashtags } from '../data/mockData';

const colorTokens = [
  {
    name: 'Electric Neon Green',
    role: 'Primary · YES · Truth',
    hex: '#00FF94',
    token: '--color-neon-green',
    glow: '0 0 24px rgba(0,255,148,0.4)'
  },
  {
    name: 'Hot Cyber Pink',
    role: 'Secondary · NO · Cap',
    hex: '#FF0055',
    token: '--color-cyber-pink',
    glow: '0 0 24px rgba(255,0,85,0.35)'
  },
  {
    name: 'Electric Blue',
    role: 'Accent · Active Tabs',
    hex: '#2E5CFF',
    token: '--color-electric-blue',
    glow: '0 0 24px rgba(46,92,255,0.35)'
  },
  {
    name: 'Pure Midnight',
    role: 'Background',
    hex: '#050505',
    token: '--color-midnight'
  },
  {
    name: 'Charcoal Glass',
    role: 'Card Surface',
    hex: 'rgba(20,20,20,0.5)',
    token: '--color-charcoal'
  },
  {
    name: 'Soft Gray',
    role: 'Body Text',
    hex: '#B5B5B5',
    token: '--color-gray'
  }
];

const atomTokens = [
  { label: 'Corner Radius', value: '20px (cards) · 9999px (CTAs)', detail: 'Ultra-pill buttons + rounded glass cards' },
  { label: 'Glass Blur', value: '20px backdrop-blur', detail: 'Frosted neon surfaces' },
  { label: 'Border', value: 'rgba(255,255,255,0.12)', detail: 'Soft 1px outlines for depth' },
  { label: 'Spacing', value: '8 · 12 · 16 · 24 · 32', detail: 'Mobile-first rhythm scale' },
  { label: 'Glow', value: 'Brand-colored drop glows', detail: 'Highlight CTAs & status chips' }
];

const interactionStates = [
  { label: 'Default', desc: 'Glass surface, subtle border, rest glow' },
  { label: 'Hover', desc: 'Border intensifies to 20%, glow brightens' },
  { label: 'Pressed', desc: 'Scale 0.95, glow tightens, opacity 0.95' },
  { label: 'Disabled', desc: 'Opacity 50%, pointer-events none' }
];

const navPreview = [
  { label: 'Home', icon: Home, active: true },
  { label: 'Explore', icon: Search },
  { label: 'My Bets', icon: Receipt },
  { label: 'Wallet', icon: Wallet },
  { label: 'Profile', icon: User }
];

export const DesignSystem = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('#ShattaVsStone live odds');
  const [phoneInput, setPhoneInput] = useState('024 123 4567');
  const [otpValue, setOtpValue] = useState('123456');
  const sampleBet = mockBets[0];
  const sampleMarket = mockMarkets[0];

  return (
    <div className="min-h-screen bg-[#050505] pb-24 text-white">
      <div className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">System</p>
            <h2 className="text-white text-lg">NoCap Design Language</h2>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/home')}>
          Launch Home
        </Button>
      </div>

      <div className="px-6 py-6 space-y-10 max-w-4xl mx-auto">
        {/* Brand DNA */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Palette className="text-[#00FF94]" size={20} />
            <div>
              <h3 className="text-xl">Color DNA</h3>
              <p className="text-gray-400 text-sm">Neon cyber gradients tuned for dark glass UI</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {colorTokens.map((token) => (
              <div key={token.name} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div
                  className="h-16 rounded-2xl mb-4"
                  style={{
                    background: token.hex.includes('rgba')
                      ? token.hex
                      : `linear-gradient(135deg, ${token.hex}, ${token.hex}cc)`,
                    boxShadow: token.glow
                  }}
                />
                <p className="font-semibold">{token.name}</p>
                <p className="text-sm text-gray-400">{token.role}</p>
                <div className="text-xs text-gray-500 mt-2">{token.token}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Type className="text-[#2E5CFF]" size={20} />
            <div>
              <h3 className="text-xl">Typography</h3>
              <p className="text-gray-400 text-sm">Inter / Satoshi with bold headers & mono odds</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
            <div>
              <p className="text-3xl font-bold mb-2">Display / 30px — Bet the Vibes</p>
              <p className="text-gray-400 text-sm">Hero headlines & balances</p>
            </div>
            <div>
              <p className="text-2xl font-semibold mb-1">Headline / 24px — Predict the Culture</p>
              <p className="text-gray-400 text-sm">Section headers</p>
            </div>
            <div>
              <p className="text-base text-gray-300 mb-1">
                Body / 16px — Storytelling copy for cards, drawers and modals.
              </p>
              <p className="text-sm text-gray-500">Supporting text & helper hints</p>
            </div>
            <div>
              <p className="font-mono text-[#00FF94] text-lg">Odds / Mono — 2.45x</p>
              <p className="text-gray-500 text-sm">Numbers & probability</p>
            </div>
          </div>
        </section>

        {/* Atoms */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-[#FF0055]" size={20} />
            <div>
              <h3 className="text-xl">Atoms & Surfaces</h3>
              <p className="text-gray-400 text-sm">Reusable decisions that keep the vibe consistent</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {atomTokens.map((atom) => (
              <div key={atom.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-gray-400 uppercase tracking-widest">{atom.label}</p>
                <p className="text-white mt-2">{atom.value}</p>
                <p className="text-gray-500 text-sm mt-1">{atom.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-[#00FF94]" size={20} />
            <div>
              <h3 className="text-xl">Buttons & CTAs</h3>
              <p className="text-gray-400 text-sm">Full-pill controls with neon glow states</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary · No Cap</Button>
            <Button variant="pink">Cap (No)</Button>
            <Button variant="blue">Accent</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex gap-3">
            <Button fullWidth size="lg" onClick={() => navigate('/deposit')}>
              Deposit Flow
            </Button>
            <Button fullWidth size="lg" variant="pink" onClick={() => navigate('/share-receipt')}>
              Share Slip
            </Button>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Gauge className="text-[#2E5CFF]" size={20} />
            <div>
              <h3 className="text-xl">Inputs & Authentication</h3>
              <p className="text-gray-400 text-sm">Form fields optimized for thumbs & MoMo</p>
            </div>
          </div>
          <div className="grid gap-4">
            <Input
              placeholder="Search markets"
              value={searchValue}
              onChange={setSearchValue}
              icon={<Search size={18} />}
            />
            <Input
              type="tel"
              placeholder="Enter mobile number"
              value={phoneInput}
              onChange={setPhoneInput}
              icon={<Phone size={18} />}
            />
            <div>
              <p className="text-gray-400 text-sm mb-2">OTP Verification</p>
              <div className="max-w-sm mx-auto">
                <OTPInput length={6} value={otpValue} onChange={setOtpValue} />
              </div>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="text-[#FF0055]" size={20} />
            <div>
              <h3 className="text-xl">Core Components</h3>
              <p className="text-gray-400 text-sm">Story bubbles, market cards, bet slips & social chat</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="pointer-events-none">
              <StoryBubbles />
            </div>
            <div className="pointer-events-none">
              <MarketCard market={sampleMarket} />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
              <p className="text-sm text-gray-400 uppercase tracking-[0.3em]">Bet Card</p>
              <div className="space-y-3">
                {sampleBet.legs.map((leg, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-10 rounded-full ${
                        leg.selection === 'yes' ? 'bg-[#00FF94]' : 'bg-[#FF0055]'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm">{leg.marketQuestion}</p>
                      <p className="text-gray-400 text-xs">
                        {leg.selection === 'yes' ? 'No Cap' : 'Cap'} · {leg.odds.toFixed(2)}x
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-sm">
                <span className="text-gray-400">Stake</span>
                <span className="font-mono">₵{sampleBet.stake.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Potential Payout</span>
                <span className="font-mono text-[#00FF94]">₵{sampleBet.potentialPayout.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <p className="text-sm text-gray-400 uppercase tracking-[0.3em] mb-4">Live Streets Chat</p>
              <div className="space-y-3">
                {mockChatMessages.slice(0, 3).map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00FF94] to-[#2E5CFF] rounded-full flex items-center justify-center">
                      {msg.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-white">{msg.username}</span>
                        <span className="text-gray-500 text-xs">{msg.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Navigation & Feedback */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Share2 className="text-[#2E5CFF]" size={20} />
            <div>
              <h3 className="text-xl">Navigation · Feedback · Shareables</h3>
              <p className="text-gray-400 text-sm">Bottom nav, toasts, receipts, hashtags</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-gray-400 text-sm mb-3">Bottom Navigation</p>
              <div className="flex justify-between">
                {navPreview.map((item) => (
                  <div
                    key={item.label}
                    className={`flex flex-col items-center gap-1 px-2 ${
                      item.active ? 'text-[#00FF94]' : 'text-gray-500'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-gray-400 text-sm">Toast / Notification</p>
              <div className="h-px bg-white/10" />
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00FF94]/10 flex items-center justify-center">
                  <Zap size={20} className="text-[#00FF94]" />
                </div>
                <div className="flex-1">
                  <p className="text-white">Bet won! ₵172.00 credited</p>
                  <p className="text-gray-400 text-sm">Tap to view receipt</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00FF94]/10 via-[#2E5CFF]/10 to-[#FF0055]/10 p-4">
              <p className="text-gray-400 text-sm mb-3">Trending Hashtags</p>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-white/5 rounded-full text-sm border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-gray-400 text-sm">Share Slip / Viral Receipt</p>
              <div className="border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-400">Event</span>
                  <span className="text-white">{sampleBet.legs[0].marketQuestion}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-400">Pick</span>
                  <span className="text-[#00FF94]">No Cap</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-400">Stake</span>
                  <span className="text-white">₵{sampleBet.stake.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Potential</span>
                  <span className="text-[#00FF94]">₵{sampleBet.potentialPayout.toFixed(2)}</span>
                </div>
              </div>
              <Button
                variant="primary"
                fullWidth
                size="sm"
                onClick={() => navigate('/share-receipt', { state: { bet: sampleBet } })}
              >
                Share to WhatsApp
              </Button>
            </div>
          </div>
        </section>

        {/* Interaction States */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-[#FF0055]" size={20} />
            <div>
              <h3 className="text-xl">Interaction States</h3>
              <p className="text-gray-400 text-sm">Hover, active, disabled rules across the kit</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {interactionStates.map((state) => (
              <div key={state.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-white font-semibold">{state.label}</p>
                <p className="text-gray-400 text-sm mt-1">{state.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#00FF94]/10 via-[#2E5CFF]/10 to-[#FF0055]/10 p-6 space-y-4">
          <h3 className="text-2xl font-semibold">Ready to bet the vibes?</h3>
          <p className="text-gray-300">
            Launch the live experience to explore onboarding, prediction markets, wallet flows and social features.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button fullWidth size="lg" onClick={() => navigate('/')}>
              Restart Onboarding
            </Button>
            <Button fullWidth size="lg" variant="blue" onClick={() => navigate('/wallet')}>
              Jump to Wallet
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

