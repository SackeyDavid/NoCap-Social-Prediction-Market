'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-card shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back 👋</h1>
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <Button className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-muted-foreground">
         Don't have an account? <Link href="/auth/sign-up" className="text-primary underline hover:text-primary/80">Sign Up</Link>
      </div>
    </div>
  )
}


