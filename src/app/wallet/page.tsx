import { getUserWallet, getTransactionHistory, topUpDemo } from '@/app/actions/wallet'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

export default async function WalletPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
     redirect('/auth/sign-in?next=/wallet')
  }

  const wallet = await getUserWallet()
  const transactions = await getTransactionHistory()

  return (
    <div className="space-y-8 pb-24 px-4 pt-6">
       <h1 className="text-2xl font-bold text-white">Wallet</h1>
       
       {/* Balance Card */}
       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00FF94] to-[#00CC76] p-6 text-black shadow-lg shadow-[#00FF94]/20">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          
          <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                  <Wallet size={20} />
                  <span className="font-medium">Total Balance</span>
              </div>
              <div className="text-4xl font-bold font-mono tracking-tight">
                  {wallet?.currency} {(wallet?.balanceCents! / 100).toFixed(2)}
              </div>
              
              <form action={topUpDemo}>
                 <button 
                    type="submit"
                    className="mt-6 w-full h-12 rounded-xl bg-black/10 hover:bg-black/20 backdrop-blur-sm border border-black/5 font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                 >
                    <span className="text-lg">+</span>
                    Top Up Demo (20 GHS)
                 </button>
              </form>
          </div>
       </div>

       {/* Transactions */}
       <div>
          <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
             {transactions.map(tx => {
                const isPositive = tx.amountCents > 0;
                return (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPositive ? 'bg-[#00FF94]/20 text-[#00FF94]' : 'bg-[#FF0055]/20 text-[#FF0055]'}`}>
                                {isPositive ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div>
                                <div className="font-medium text-white capitalize">{tx.type.replace('_', ' ')}</div>
                                <div className="text-gray-500 text-xs">{new Date(tx.createdAt).toLocaleString()}</div>
                            </div>
                        </div>
                        <div className={`font-bold font-mono ${isPositive ? 'text-[#00FF94]' : 'text-white'}`}>
                            {isPositive ? '+' : ''}{(tx.amountCents / 100).toFixed(2)}
                        </div>
                    </div>
                )
             })}
             {transactions.length === 0 && (
                <div className="text-gray-500 text-center py-12 border border-white/10 border-dashed rounded-3xl">
                    No transactions yet.
                </div>
             )}
          </div>
       </div>
    </div>
  )
}
