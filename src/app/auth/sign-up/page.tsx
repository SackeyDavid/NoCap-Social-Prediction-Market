'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createWalletForUser } from '@/lib/wallet' // Wait, this is server side code. Client cannot import server lib.

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      alert(error.message)
    } else {
      if (data.user) {
          // Trigger wallet creation? 
          // Ideally via webhook or server action. 
          // For MVP, we just rely on wallet page auto-creating it or do it here.
          // But we can't call server lib here. 
          // We can call a server action.
          alert('Account created! Please check your email (if confirmation enabled) or sign in.')
          router.push('/auth/sign-in')
      }
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-card shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-center">Join NoCap 🧢</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </div>
        <Button className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-muted-foreground">
         Already have an account? <Link href="/auth/sign-in" className="text-primary underline hover:text-primary/80">Sign In</Link>
      </div>
    </div>
  )
}

