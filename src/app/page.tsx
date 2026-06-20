import Link from 'next/link'
import { Rocket, Target, Brain, Trophy, Sparkles, ArrowRight, Eye } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg">Mission Control OS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Get Started
          </Link>
          <Link href="/demo" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
            <Eye className="w-4 h-4" />
            Tour the App
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            AI-Powered Productivity Operating System
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Your personal{' '}
            <span className="text-gradient">mission control</span>
            {' '}for productivity
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage missions, track campaigns, level up with XP and achievements, 
            stay focused with ambient environments, and let AI plan your day.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass font-medium hover:bg-muted/50 transition-colors"
            >
              <Eye className="w-4 h-4" /> Take the Tour
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-20">
          {[
            { icon: Target, title: 'Mission Engine', desc: 'Track tasks with priorities, difficulties, dependencies, and XP rewards' },
            { icon: Brain, title: 'AI Planning', desc: 'Let AI break down goals, generate missions, and plan your weeks' },
            { icon: Trophy, title: 'Gamification', desc: 'Level up, earn achievements, maintain streaks, and unlock rewards' },
          ].map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="glass rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Built with Next.js, Supabase, Prisma, and AI. Deployed on Vercel.
          </p>
        </div>
      </main>
    </div>
  )
}
