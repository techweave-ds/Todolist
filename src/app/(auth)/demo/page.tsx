'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Rocket, Target, Brain, Trophy, Sparkles, Timer, LayoutDashboard, ListTodo, BarChart3, Settings, ChevronRight, ChevronLeft, Eye } from 'lucide-react'

const steps = [
  {
    title: 'Welcome to Mission Control OS',
    icon: Rocket,
    description: 'Your AI-powered productivity operating system. Manage missions, track campaigns, level up with XP, and let AI plan your day.',
    color: 'from-primary to-accent',
  },
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Your mission HQ. View today\'s missions, your XP progress, current streak, and AI-generated daily briefing — all in one place.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Missions',
    icon: ListTodo,
    description: 'Create tasks with priorities (low/critical), difficulties (easy/legendary), deadlines, and XP rewards. Group them into campaigns, add subtasks, and track dependencies.',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Campaigns',
    icon: Target,
    description: 'Group related missions into campaigns — like "Q2 Product Launch" or "Learning Kubernetes". Track progress across mission clusters.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Focus Mode',
    icon: Timer,
    description: 'Pomodoro timer with ambient sound environments. Track your focus sessions, distractions, and build a productivity streak.',
    color: 'from-green-500 to-teal-500',
  },
  {
    title: 'Gamification',
    icon: Trophy,
    description: 'Earn XP for completing missions, unlock achievements, maintain daily streaks, and level up. Each level unlocks new workspace upgrades.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'AI Planning',
    icon: Brain,
    description: 'Let AI break down big goals into missions, generate weekly plans, get motivational coaching, and create smart daily briefings.',
    color: 'from-violet-500 to-indigo-500',
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    description: 'Track completion rates, focus trends, category distribution, and productivity patterns over time.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Workspace',
    icon: Sparkles,
    description: 'Customize your 3D workspace with themes, ambiance, and decorations. Unlock new items as you level up.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Settings & Audio',
    icon: Settings,
    description: 'Fine-tune audio balance across 7 channels (music, SFX, ambient, voice, UI), choose sound profiles, and customize your experience.',
    color: 'from-gray-500 to-slate-500',
  },
]

export default function DemoPage() {
  const [step, setStep] = useState(0)
  const current = steps[step]
  const Icon = current.icon

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        <div className="glass-strong rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-sm">Demo Tour</span>
            </div>
            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-primary w-4' : 'bg-muted'}`} />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center text-center mb-8">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${current.color} bg-opacity-20 flex items-center justify-center mb-6`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">{current.title}</h2>
            <p className="text-muted-foreground max-w-md">{current.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/register"
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Get Started <Rocket className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Eye className="w-4 h-4" /> Try Interactive Demo
          </Link>
          <Link href="/register" className="text-sm text-primary hover:underline">
            Skip tour
          </Link>
        </div>
      </div>
    </div>
  )
}
