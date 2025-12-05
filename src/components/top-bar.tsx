'use client'
import { Bell } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { getUserWallet } from '@/app/actions/wallet'

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

  return (
    <div className="sticky top-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 z-30">
      <div className="flex items-center justify-between px-6 h-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00FF94] to-[#2E5CFF] rounded-lg flex items-center justify-center">
            <span className="text-black text-lg">⚡</span>
          </div>
          <span className="text-white font-bold text-lg">NoCap</span>
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


