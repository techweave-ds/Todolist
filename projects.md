# Mission Control OS — Project Map

## Concept
A gamified, AI-powered productivity OS that wraps task management in a "mission command" narrative. Users are Commanders who deploy Missions, run Campaigns, earn XP/Achievements, maintain Streaks, and get AI-driven planning — all inside a dark-theme glassmorphism cockpit.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (Turbopack, App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first config via `@theme inline`) |
| Animations | Framer Motion |
| Database ORM | Prisma (PostgreSQL) |
| Auth | Supabase Auth (Email, Google, GitHub, Magic Link) |
| Hosting | Railway (Nixpacks builder, PostgreSQL plugin) |
| AI | Multi-provider (OpenAI / Anthropic / Gemini via feature flag) |
| Audio | Custom Web Audio engine (7-channel mixer) |
| State | Zustand (10 stores) |
| Events | Custom event bus |
| Testing | Vitest + Playwright |

## Directory Architecture

```
src/
├── proxy.ts                    # Next.js 16 middleware — auth guard + CSP + route protection
├── ai/                         # AI engine + providers (OpenAI/Anthropic/Gemini)
├── analytics/                  # Analytics event system
├── app/                        # Next.js App Router pages & layouts
│   ├── layout.tsx              # Root layout (dark class, font setup)
│   ├── globals.css             # Design tokens, keyframes, glass/utility classes
│   ├── providers.tsx           # Client providers (audio init, event subscribers)
│   ├── actions.ts              # Server Actions (CRUD, demo lifecycle)
│   ├── (app)/layout.tsx        # Authenticated shell — sidebar + header + glow background
│   ├── (app)/dashboard/        # Command Center — main HQ page
│   ├── (app)/missions/         # Mission CRUD with filters & AI generation
│   ├── (app)/campaigns/        # Campaign grouping for missions
│   ├── (app)/focus/            # Pomodoro timer + focus sessions
│   ├── (app)/achievements/     # Badges, trophies, rank progression
│   ├── (app)/analytics/        # Charts + productivity trends
│   ├── (app)/memory-lane/      # Historical activity log
│   ├── (app)/workspace/        # 3D workspace customization
│   ├── (app)/settings/         # Preferences + audio mixer
│   ├── (auth)/login/           # Login with OAuth + demo entry
│   ├── (auth)/register/        # Email registration
│   ├── (auth)/demo/            # 10-step guided tour
│   ├── auth/callback/          # Supabase auth redirect handler
│   └── api/                    # Route handlers (health, auth callback)
├── assets/                     # Static assets
├── audio/                      # Web Audio engine, tracks, SFX
├── components/
│   ├── ui/                     # Primitive components (EmptyState, GlowBackground, Button, Card, Dialog, Input, Select, Badge, Progress)
│   ├── glass/                  # Glassmorphism composites (GlassCard, LevelProgress, XpDisplay)
│   ├── layout/                 # Shell (Sidebar, Header, CommandPalette)
│   ├── dashboard/              # MissionHero, CommanderProfile
│   ├── ai/                     # DailyBriefing, WeeklyPlanner, AICoach, GoalBreakdown
│   ├── auth/                   # SessionInitializer
│   └── */                      # Per-domain component folders (achievements/, campaigns/, focus/, etc.)
├── core/
│   ├── types/                  # TypeScript types per domain (mission.ts, campaign.ts, achievement.ts, etc.)
│   ├── constants/              # App-wide constants
│   └── events/                 # Event bus + subscribers
├── database/                   # Prisma migrations + seeds
├── features/                   # Domain logic (XP, achievements, streaks, audio, etc.)
├── hooks/                      # Shared hooks (useFocus, useDebounce, useKeyboard, etc.)
├── lib/                        # Utilities (prisma client, supabase clients, demo constants, analytics wrapper)
├── notifications/              # Email + push notification providers
├── services/                   # Server-side service layer per domain (mission-service, xp-service, etc.)
└── store/                      # Zustand stores per domain (app-store, mission-store, xp-store, ai-store, etc.)
```

## Data Flow

```
Pages (app/*/page.tsx)
  │  reads/writes via
  ▼
Zustand Stores (store/*.ts)
  │  call
  ▼
Services (services/*/*.ts) — server-side business logic
  │  use
  ▼
Prisma ORM → PostgreSQL
```

Server Actions (`actions.ts`) bypass stores for form submissions (createMission, completeMission, etc.).

## Integration Points

- **`src/app/(app)/layout.tsx`** — Wraps all authenticated pages with `<Sidebar>`, `<Header>`, `<SessionInitializer>`, `<GlowBackground>`, `<CommandPalette>`
- **`src/app/(app)/dashboard/page.tsx`** — Primary integration surface; composes MissionHero, CommanderProfile, DailyBriefing, WeeklyPlanner, stat cards, mission list, campaign progress, AICoach, GoalBreakdown
- **`src/app/(app)/missions/page.tsx`** — Full CRUD with filters, AI generation trigger, EmptyState for zero-data
- **`src/app/providers.tsx`** — Initializes audio engine + event bus on mount
- **`src/proxy.ts`** — Middleware guarding all `/dashboard`, `/missions`, etc. routes; redirects to `/login` if unauthenticated; injects CSP headers

## Environment Variables (`.env.local`)

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
ANTHROPIC_API_KEY=xxx
OPENAI_API_KEY=xxx
GOOGLE_AI_API_KEY=xxx
NEXT_PUBLIC_SENTRY_DSN=xxx
```
