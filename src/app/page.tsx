import Link from 'next/link'
import { Rocket, Target, Brain, Trophy, Sparkles, ArrowRight, Eye, ListChecks, Timer, Medal, Flag, Layers, ScrollText, BarChart3, History, BookOpen, Users, Workflow, Zap, TrendingUp } from 'lucide-react'

const FEATURES = [
  { icon: Target, title: 'Missions', desc: 'Tasks with priority, difficulty, deadlines, XP rewards, and subtasks. Filter by status, sort by urgency.' },
  { icon: Flag, title: 'Campaigns', desc: 'Group missions into campaigns. Track completion progress and total XP earned per campaign.' },
  { icon: Timer, title: 'Focus Sessions', desc: 'Pomodoro and deep-focus timers with ambient sound environments. Track your concentration streaks.' },
  { icon: Trophy, title: 'Achievements', desc: 'Unlock achievements for consistency — first mission, 100 missions, 30-day streaks, level milestones.' },
  { icon: Medal, title: 'XP & Leveling', desc: 'Earn XP per mission based on difficulty. Level up with animated progress bars and rank titles.' },
  { icon: Brain, title: 'AI Coach', desc: 'AI that breaks down goals, generates weekly plans, provides coaching, and writes daily briefings.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track completion rates, focus time trends, category distribution, and peak productivity hours.' },
  { icon: ScrollText, title: 'Memory Lane', desc: 'A growing timeline of your milestones — achievements, streaks, campaigns completed, and major wins.' },
  { icon: Layers, title: 'Living Workspace', desc: 'A 3D workspace that evolves as you progress — new furniture, monitors, plants, and awards appear over time.' },
  { icon: History, title: 'Audio Environments', desc: 'Ambient sound profiles — focus, lo-fi, rain, space — controlled per-bus with crossfade transitions.' },
]

const USE_CASES = [
  {
    icon: Users, title: 'For Students',
    steps: [
      'Break semester goals into weekly campaigns',
      'Track assignments as missions with deadlines',
      'Use focus sessions for study blocks',
      'Watch your campus workspace grow as you progress',
    ],
    bg: 'from-blue-500/10 via-transparent to-purple-500/10',
  },
  {
    icon: Workflow, title: 'For Professionals',
    steps: [
      'Organize projects as campaigns with milestones',
      'Prioritize daily tasks with the mission queue',
      'Let AI plan your week from a single goal',
      'Review productivity trends in analytics',
    ],
    bg: 'from-emerald-500/10 via-transparent to-teal-500/10',
  },
  {
    icon: BookOpen, title: 'For Creators',
    steps: [
      'Map content calendars as creative campaigns',
      'Set difficulty per deliverable — easy drafts, legendary launches',
      'Use focus mode with lo-fi or nature ambience',
      'Unlock workspace awards as you publish',
    ],
    bg: 'from-orange-500/10 via-transparent to-pink-500/10',
  },
  {
    icon: Zap, title: 'For Builders',
    steps: [
      'Use the AI goal breakdown for feature planning',
      'Track sprints as campaigns with XP rewards',
      'Compete with yourself — beat streaks and level up',
      'Inspect every metric in the analytics dashboard',
    ],
    bg: 'from-violet-500/10 via-transparent to-indigo-500/10',
  },
]

const HOW_STEPS = [
  { num: '01', title: 'Define Your Objectives', desc: 'Create missions with priority, difficulty, and deadlines. Group them into campaigns. Or let AI break down a big goal into actionable missions.' },
  { num: '02', title: 'Execute & Focus', desc: 'Work through your mission queue. Use pomodoro or deep-focus sessions with ambient audio. AI coaches you when you need motivation.' },
  { num: '03', title: 'Grow & Reflect', desc: 'Earn XP, level up, unlock achievements, and watch your Living Workspace evolve. Review your Memory Lane to see how far you have come.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

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

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        {/* HERO */}
        <section className="pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            AI-Powered Productivity Operating System
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Your personal{' '}
            <span className="text-gradient">mission control</span>
            <br />
            for productivity
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Mission Control OS turns your tasks into missions, your goals into campaigns, and your progress into a 
            living workspace that grows with you. AI plans your week. Focus sessions track your flow. 
            Achievements celebrate every milestone.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass font-medium hover:bg-muted/50 transition-colors"
            >
              <Eye className="w-4 h-4" /> Live Demo
            </Link>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">How it works</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Three simple loops — plan, execute, grow. The system adapts to how you work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_STEPS.map((step) => (
              <div key={step.num} className="glass rounded-2xl p-6 relative">
                <span className="text-4xl font-bold text-primary/20 absolute top-4 right-4 select-none">{step.num}</span>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  {step.num === '01' ? <ListChecks className="w-5 h-5 text-primary" /> :
                   step.num === '02' ? <Timer className="w-5 h-5 text-primary" /> :
                   <TrendingUp className="w-5 h-5 text-primary" />}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* USE CASES */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">Built for how you work</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Whether you are studying, building, creating, or managing — the workflow stays the same.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className={`glass rounded-2xl p-6 bg-gradient-to-br ${uc.bg}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <uc.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{uc.title}</h3>
                </div>
                <ul className="space-y-2">
                  {uc.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5 shrink-0">→</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">Everything in one console</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Ten integrated tools. One dashboard. Zero configuration needed.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="glass rounded-xl p-4 hover:bg-muted/20 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="glass-strong rounded-3xl p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready for takeoff?</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
              No credit card. No configuration. Sign up and your command center is online in seconds.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass font-medium hover:bg-muted/50 transition-colors"
              >
                <Eye className="w-4 h-4" /> Explore Demo
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 text-center">
          <p className="text-xs text-muted-foreground">
            Built with Next.js, Prisma, Three.js, and AI. Mission Control OS &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  )
}
