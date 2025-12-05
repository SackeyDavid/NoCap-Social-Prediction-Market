'use client'
import { Bell } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { getUserWallet } from '@/app/actions/wallet'
import { usePathname } from 'next/navigation'

export function TopBar() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)

  // Simple effect to fetch balance if user is logged in
  // In a real app, use a more robust state manager or swr/react-query
  useEffect(() => {
    if (user) {
      getUserWallet().then(w => {
        if (w) setBalance(w.balanceCents / 100)
      })
    }
  }, [user])

  const pathname = usePathname()

  // Hide TopBar on market detail pages as they have their own immersive header
  if (pathname?.startsWith('/markets/')) return null

  return (
    <div className="sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-30">
      <div className="flex items-center justify-between px-6 h-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] shadow-lg shadow-[#2563EB]/30 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-white/5" />
              <span className="relative text-white text-lg">🧢</span>
            </div>
          </div>
          <div>
            <div className="text-white font-black text-lg leading-tight">NoCap</div>
            <div className="text-xs text-gray-500">Prediction Markets</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative">
            <Bell size={20} className="text-gray-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF0055] rounded-full" />
          </button>
          {user ? (
            <div className="bg-white/10 px-4 py-2 rounded-full">
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


