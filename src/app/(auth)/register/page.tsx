'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Rocket } from 'lucide-react'
import { registerUser } from '@/app/actions'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const form = new FormData()
    form.set('email', email)
    form.set('password', password)
    form.set('name', name || email.split('@')[0])

    try {
      const result = await registerUser(form)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-md glass-strong rounded-2xl p-8 shadow-2xl">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
          <Rocket className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-muted-foreground mt-1">Start your productivity journey</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Display name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {error && (
        <p className="text-sm text-center mt-4 text-red-400">{error}</p>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <a href="/login" className="text-primary hover:underline">Sign in</a>
      </p>
    </div>
  )
}
