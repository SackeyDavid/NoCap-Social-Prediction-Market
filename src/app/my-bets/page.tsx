import { getMyBets } from '@/app/actions/bets'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Ticket, Clock, CheckCircle, XCircle } from 'lucide-react'

export default async function MyBetsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const bets = await getMyBets()

  return (
    <div className="space-y-6 pb-24 px-4 pt-6">
      <h1 className="text-2xl font-bold text-white">My Bets</h1>
      <div className="space-y-4">
        {bets.map((bet) => {
            let StatusIcon = Clock;
            let statusColor = 'text-yellow-500';
            let statusBg = 'bg-yellow-500/10';

            if (bet.status === 'won') {
                StatusIcon = CheckCircle;
                statusColor = 'text-[#00FF94]';
                statusBg = 'bg-[#00FF94]/10';
            } else if (bet.status === 'lost') {
                StatusIcon = XCircle;
                statusColor = 'text-[#FF0055]';
                statusBg = 'bg-[#FF0055]/10';
            }

            const label = bet.optionLabel || 'Unknown';

            return (
              <div key={bet.id} className="bg-white/5 border border-white/5 rounded-2xl p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
                        <StatusIcon size={14} />
                        <span className="capitalize">{bet.status}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                        {new Date(bet.createdAt).toLocaleDateString()}
                    </span>
                </div>
                
                <h3 className="text-white font-medium mb-4 leading-snug">{bet.marketTitle}</h3>
                
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 mb-1">Selection</span>
                        <span className={`font-bold ${label.toLowerCase().includes('yes') ? 'text-[#00FF94]' : 'text-[#FF0055]'}`}>
                            {label}
                        </span>
                    </div>
                    <div className="h-8 w-[1px] bg-white/10" />
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 mb-1">Potential Payout</span>
                        <span className="font-bold font-mono text-white">
                            ₵{(bet.payout / 100).toFixed(2)}
                        </span>
                    </div>
                </div>
              </div>
            )
        })}
        {bets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 border border-white/10 border-dashed rounded-3xl bg-white/5">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-600">
                    <Ticket size={32} />
                </div>
                <p className="text-gray-400 mb-6">You haven't placed any bets yet.</p>
                <a 
                    href="/" 
                    className="px-6 py-3 bg-[#00FF94] hover:bg-[#00FF94]/90 text-black font-bold rounded-full transition-all active:scale-95"
                >
                    Find a market
                </a>
            </div>
        )}
      </div>
    </div>
  )
}
