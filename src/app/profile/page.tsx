'use client'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Wallet, LogOut, Receipt, Settings, ChevronRight } from 'lucide-react'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  
  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/sign-in')
  }

  if (!user) {
      return (
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 p-6">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2">
                  <span className="text-4xl">👻</span>
              </div>
              <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Not Signed In</h2>
                  <p className="text-gray-400 mb-8">Join NoCap to track your bets and winnings.</p>
              </div>
              <button 
                onClick={() => router.push('/auth/sign-in')}
                className="w-full h-14 bg-[#00FF94] hover:bg-[#00FF94]/90 text-black rounded-full font-bold text-lg transition-all active:scale-95"
              >
                Sign In / Sign Up
              </button>
          </div>
      )
  }

  return (
    <div className="pb-24 px-4 pt-6">
       {/* Profile Header */}
       <div className="flex flex-col items-center mb-10">
            <div className="relative mb-4">
                <Avatar className="w-28 h-28 border-4 border-[#00FF94]/20">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-3xl font-bold bg-white/10 text-[#00FF94]">
                        {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#00FF94] rounded-full border-4 border-[#050505] flex items-center justify-center">
                    <span className="text-black text-xs font-bold">✓</span>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-white">{user.user_metadata?.full_name || user.email?.split('@')[0]}</h1>
            <p className="text-gray-500 text-sm">@{user.email?.split('@')[0]}</p>
       </div>

       {/* Menu Items */}
       <div className="space-y-4">
           <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/5">
               <MenuItem 
                 icon={Wallet} 
                 label="Wallet & Transactions" 
                 onClick={() => router.push('/wallet')} 
               />
               <div className="h-[1px] bg-white/5 mx-4" />
               <MenuItem 
                 icon={Receipt} 
                 label="My Betting History" 
                 onClick={() => router.push('/my-bets')} 
               />
           </div>

           <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/5">
               <MenuItem 
                 icon={Settings} 
                 label="Settings" 
                 onClick={() => {}} 
               />
           </div>

           <button 
             onClick={handleSignOut}
             className="w-full h-14 bg-[#FF0055]/10 hover:bg-[#FF0055]/20 text-[#FF0055] rounded-full font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-8"
           >
             <LogOut size={20} />
             Sign Out
           </button>
       </div>
    </div>
  )
}

function MenuItem({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#00FF94] group-hover:scale-110 transition-transform">
                    <Icon size={20} />
                </div>
                <span className="text-white font-medium">{label}</span>
            </div>
            <ChevronRight size={20} className="text-gray-600" />
        </button>
    )
}
