'use client'
import Link from 'next/link'
import { Home, Search, Receipt, Wallet, User, Trophy } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/theme-context'

export function BottomNav() {
  const pathname = usePathname()
  const { theme } = useTheme()

  const items = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/explore', icon: Search, label: 'Explore' },
    { href: '/leaderboard', icon: Trophy, label: 'Rankings' },
    { href: '/my-bets', icon: Receipt, label: 'My Bets' },
    { href: '/wallet', icon: Wallet, label: 'Wallet' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <div className={`fixed bottom-0 left-0 right-0 border-t backdrop-blur-lg z-50 md:hidden transition-colors ${theme === 'dark'
        ? 'bg-[#0A0A0A] border-white/10'
        : 'bg-white border-gray-200'
      }`}>
      <div className="flex justify-around items-center h-20 px-4">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 flex-1 w-full h-full justify-center">
              <Icon
                size={24}
                strokeWidth={2}
                className={cn(
                  "transition-colors",
                  isActive ? "text-[#00FF94]" : theme === 'dark' ? "text-gray-500" : "text-gray-400"
                )}
              />
              <span className={cn(
                "text-xs transition-colors font-medium",
                isActive ? "text-[#00FF94]" : theme === 'dark' ? "text-gray-500" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
