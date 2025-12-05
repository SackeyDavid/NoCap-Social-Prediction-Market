'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { placeBet } from '@/app/actions/bets'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export function BettingInterface({ market, options }: { market: any, options: any[] }) {
  const { user } = useAuth()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [stake, setStake] = useState<string>('10')
  const [loading, setLoading] = useState(false)

  const handleBet = async () => {
    if (!user) {
        // In a real app, redirect to login
        return alert('Please login to bet')
    }
    if (!selectedOption) return
    
    setLoading(true)
    try {
       // Input is in GHS, convert to cents
       const stakeCents = Math.floor(parseFloat(stake) * 100)
       const res = await placeBet(market.id, selectedOption, stakeCents)
       
       if (res.success) {
         alert('Bet placed! Good luck! 🍀 No Cap!')
         setStake('10')
         setSelectedOption(null)
       } else {
         alert('Error: ' + res.error)
       }
    } catch (e) {
       alert('Failed to place bet')
    } finally {
       setLoading(false)
    }
  }

  const potentialReturn = (parseFloat(stake || '0') * 1.9).toFixed(2)

  return (
    <div className="p-6 border border-white/10 rounded-3xl bg-white/5 mt-6 backdrop-blur-xl">
        <h3 className="font-bold text-xl mb-6 text-white">Place your Prediction</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
            {options.map(opt => {
                const isSelected = selectedOption === opt.id;
                const isYes = opt.label.toLowerCase().includes('yes');
                const baseColor = isYes ? 'bg-[#00FF94] text-black' : 'bg-[#FF0055] text-white';
                
                return (
                    <button 
                        key={opt.id}
                        className={cn(
                            "h-14 rounded-full text-lg font-bold transition-all active:scale-95",
                            isSelected 
                                ? baseColor 
                                : "bg-white/10 text-gray-400 hover:bg-white/20"
                        )}
                        onClick={() => setSelectedOption(opt.id)}
                    >
                        {opt.label}
                    </button>
                )
            })}
        </div>

        {selectedOption && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-400">Stake (GHS)</label>
                    <Input 
                        type="number" 
                        value={stake} 
                        onChange={e => setStake(e.target.value)}
                        min="1"
                        className="h-14 rounded-2xl bg-white/5 border-white/10 text-white text-lg font-mono focus-visible:ring-[#00FF94] focus-visible:border-[#00FF94]"
                    />
                </div>

                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-gray-400 text-sm">Potential Return (1.9x)</span>
                    <span className="font-bold text-[#00FF94] text-xl font-mono">GHS {potentialReturn}</span>
                </div>

                <button 
                    onClick={handleBet} 
                    disabled={loading} 
                    className="w-full h-14 bg-[#2E5CFF] hover:bg-[#2E5CFF]/90 text-white rounded-full font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Placing Bet...' : 'Confirm Bet 🚀'}
                </button>
            </div>
        )}
    </div>
  )
}
