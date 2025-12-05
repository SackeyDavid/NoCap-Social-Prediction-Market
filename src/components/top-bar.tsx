'use client'
import { Bell, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { getUserWallet } from '@/app/actions/wallet'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/theme-context'

export function TopBar() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (user) {
      getUserWallet().then(w => {
        if (w) setBalance(w.balanceCents / 100)
      })
    }
  }, [user])

  const pathname = usePathname()

  if (pathname?.startsWith('/markets/')) return null

  return (
    <div className={`sticky top-0 backdrop-blur-xl border-b z-30 transition-colors ${theme === 'dark'
      ? 'bg-[#050505]/80 border-white/10'
      : 'bg-white/80 border-black/10'
      }`}>
      <div className="flex items-center justify-between px-6 h-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] shadow-lg shadow-[#2563EB]/30 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-white/5" />
              <span className="relative text-white text-lg">🧢</span>
            </div>
          </div>
          <div>
            <div className={`font-black text-lg leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>NoCap</div>
            <div className="text-xs text-gray-500">Prediction Markets</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark'
                ? 'bg-gray-700'
                : 'bg-blue-500'
              }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${theme === 'dark'
                  ? 'left-0.5'
                  : 'left-[26px]'
                }`}
            >
              {theme === 'dark' ? (
                <Moon size={12} className="text-gray-700" />
              ) : (
                <Sun size={12} className="text-yellow-500" />
              )}
            </div>
          </button>

          <button className="relative">
            <Bell size={20} className="text-gray-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF0055] rounded-full" />
          </button>

          {user ? (
            <div className={`px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'
              }`}>
              <span className="text-[#00FF94] font-mono font-bold">₵{balance.toFixed(2)}</span>
            </div>
          ) : (
            <a href="/auth/sign-in" className="text-sm text-primary hover:underline">Sign In</a>
          )}
        </div>
      </div>
    </div>
  )
}
