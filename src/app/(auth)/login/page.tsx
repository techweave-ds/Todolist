'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Rocket, GitBranch, Mail, Eye, Info } from 'lucide-react'
import { authService } from '@/services/auth'
import { startDemo, loginWithEmail as localLogin } from '@/app/actions'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const form = new FormData()
      form.set('email', email)
      form.set('password', password)
      const result = await localLogin(form)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await authService.loginWithGoogle()
    } catch {
      setError('Failed to login with Google')
    }
  }

  const handleGithubLogin = async () => {
    try {
      await authService.loginWithGithub()
    } catch {
      setError('Failed to login with GitHub')
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await authService.sendMagicLink(email)
      setError('Magic link sent! Check your email.')
    } catch {
      setError('Failed to send magic link')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemo = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await startDemo()
      window.location.href = '/dashboard'
    } catch {
      setError('Failed to start demo')
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
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to Mission Control OS</p>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {error && (
        <p className="text-sm text-center mb-4 text-accent">{error}</p>
      )}

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-card text-muted-foreground">or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <button onClick={handleGoogleLogin} className="flex items-center justify-center px-4 py-2.5 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        </button>
        <button onClick={handleGithubLogin} className="flex items-center justify-center px-4 py-2.5 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
          <GitBranch className="w-5 h-5" />
        </button>
        <button onClick={handleMagicLink} className="flex items-center justify-center px-4 py-2.5 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
          <Mail className="w-5 h-5" />
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-card text-muted-foreground">or explore</span>
        </div>
      </div>

      <button
        onClick={handleDemo}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary/30 text-primary font-medium text-sm hover:bg-primary/5 transition-all disabled:opacity-50"
      >
        <Eye className="w-4 h-4" />
        Try Demo — No Sign Up Required
      </button>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Link href="/demo" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
          <Info className="w-3 h-3" /> Tour the app
        </Link>
        <span className="text-xs text-muted-foreground">·</span>
        <Link href="/register" className="text-xs text-primary hover:underline">Sign up</Link>
      </div>
    </div>
  )
}
