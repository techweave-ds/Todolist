# Mission Control OS — Project Overview

## Concept

Mission Control OS is an **AI-powered productivity operating system** — a gamified task management platform that transforms daily work into an engaging, rewarding experience. Users complete "missions" (tasks), earn XP, level up, unlock achievements, and build a personalized 3D workspace. AI agents provide coaching, daily briefings, and goal breakdown assistance.

---

## Core Philosophy

1. **Gamification drives consistency** — XP, levels, streaks, achievements, and a growing 3D workspace make productivity feel like progress
2. **AI as a coach, not a crutch** — AI breaks down goals, plans weeks, motivates, and gives feedback, but the user stays in control
3. **Immersive feedback** — Procedural audio, animations, and visual effects celebrate every accomplishment
4. **Event-driven architecture** — Services communicate through a central Pub/Sub event bus for loose coupling

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| State | Zustand 5 (11 stores) |
| Database | PostgreSQL via Prisma 5 ORM (18 models) |
| Auth | Supabase Auth + local cookie fallback |
| Audio | Web Audio API (procedural synthesis, no audio files) |
| 3D | Three.js via @react-three/fiber + drei |
| AI | Multi-provider: Groq (default), OpenAI, Anthropic, Gemini |
| Testing | Vitest, Playwright, Testing Library |
| Deployment | Vercel (primary), Railway (alternative) |

---

## Project Structure

```
src/
├── ai/                  # AI engine + 4 provider plugins
├── app/                 # Next.js App Router (14 pages + 3 API routes)
│   ├── (app)/           # Authenticated layout (sidebar + header)
│   ├── (auth)/          # Auth layout (login/register/demo)
│   ├── api/             # REST API routes
│   └── actions.ts       # 40+ server actions
├── assets/              # Static assets
├── audio/               # Web Audio API engine (6 buses, 12 sounds, 8 ambients)
├── components/          # 35+ React components
│   ├── ai/              # AI coach, goal breakdown, briefing, planner
│   ├── auth/            # Session initializer
│   ├── dashboard/       # Hero, commander profile
│   ├── glass/           # Glassmorphism UI primitives
│   ├── landing/         # Landing page sections (8 components)
│   ├── layout/          # Sidebar, header, command palette
│   ├── missions/        # Subtask list
│   ├── notifications/   # Bell, provider
│   ├── ui/              # Button, card, dialog, input, select, badge, progress, etc.
│   └── workspace/       # 3D scene + objects (8 components)
├── core/                # Shared infrastructure
│   ├── constants/       # XP values, achievements, focus, themes, nav, workspace objects
│   ├── events/          # Event bus (Pub/Sub)
│   └── types/           # All shared TypeScript types + AI types + notification type
├── hooks/               # 7 custom hooks (useMissions, useNotifications, useAudioReactivity, etc.)
├── lib/                 # Utilities, Prisma client, Supabase clients, service error handler
├── services/            # 14 domain service modules
│   ├── achievements/    # 11 achievement conditions evaluated on mission completion
│   ├── ai/              # AI service layer
│   ├── analytics/       # Dashboard stats, trends, category distribution
│   ├── audio/           # Re-exports from audio/engine
│   ├── auth/            # Supabase auth wrapper
│   ├── campaigns/       # Campaign CRUD
│   ├── focus/           # Focus session CRUD, statistics, weekly data
│   ├── memory-lane/     # Timeline entries, annual wrapped
│   ├── missions/        # Mission CRUD, history, filters
│   ├── notifications/   # Notification CRUD
│   ├── rewards/         # Reward orchestration (XP + streak + achievements)
│   ├── streaks/         # Daily streak tracking
│   ├── workspace/       # Workspace progression
│   └── xp/              # XP calculation, leveling
└── store/               # 11 Zustand stores
    ├── achievement-store.ts
    ├── ai-store.ts
    ├── analytics-store.ts
    ├── app-store.ts
    ├── audio-store.ts
    ├── campaign-store.ts
    ├── focus-store.ts
    ├── memory-lane-store.ts
    ├── mission-store.ts
    ├── workspace-store.ts
    └── xp-store.ts
```

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Pages | 14 (including landing, auth, dashboard, missions, campaigns, focus, analytics, achievements, memory lane, workspace, settings, 404) |
| API Routes | 3 (health, audio-prefs, auth callback) |
| Server Actions | 40+ |
| Database Models | 18 |
| Zustand Stores | 11 |
| Services | 14 |
| React Components | 35+ |
| Audio Sound Effects | 12 procedural |
| Audio Ambients | 8 procedural |
| AI Providers | 4 (Groq, OpenAI, Anthropic, Gemini) |
| Achievement Types | 11 |
| Workspace Objects | 26 across 5 stages |
| Lines of Code | ~8,000+ |

---

## Key Features

- **Mission Management**: Full CRUD with priorities, difficulties, deadlines, reminders, categories, tags, subtasks, dependencies
- **Campaign System**: Group missions under larger goals with progress tracking
- **Focus Timer**: Pomodoro/short break/long break/custom with distraction tracking, statistics, weekly chart
- **XP & Leveling**: 4 difficulty tiers (25/50/100/250 XP), level scaling, 11 achievements
- **Streak Tracking**: Daily streaks with automatic reset detection
- **AI Features**: Goal breakdown, weekly planning, daily briefing, motivational coaching
- **Audio Engine**: 6-bus procedural audio system with 12 sound effects and 8 ambient environments
- **3D Workspace**: 26 unlockable objects across 5 stages
- **Memory Lane**: Chronological timeline of achievements, milestones, and major wins
- **Analytics Dashboard**: Completion rates, focus trends, XP growth, category distribution
- **Notifications**: Bell with unread count, browser notifications for reminders, 30s polling
- **Auth**: Supabase OAuth (Google/GitHub), magic link, local cookie fallback, demo mode
- **Settings**: 4 tabs — Audio (6 volume sliders, profile selector, ambient selector, sound preview), Appearance (6 themes), Notifications (5 toggles), Privacy (3 toggles)
