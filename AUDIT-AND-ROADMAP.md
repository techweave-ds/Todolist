# Mission Control OS — Architecture Audit & Development Roadmap

> **Project**: Mission Control OS — AI-powered productivity operating system  
> **Stack**: Next.js 16.2.7 · React 19 · TypeScript · TailwindCSS 4 · Prisma 5.22 · Zustand 5 · Supabase  
> **Build**: ✅ 15 static routes · 0 TypeScript errors · 0 lint errors  
> **Last audit**: June 3, 2026

---

## 1. Architecture Overview

### 1.1 Directory Structure

```
src/
├── ai/                  # AI service layer (OpenAI, Anthropic, Gemini)
├── analytics/           # Analytics service
├── app/                 # Next.js App Router pages & layouts
│   ├── (app)/           # Authenticated app layout (sidebar + header)
│   ├── (auth)/          # Auth layout (login/register)
│   ├── achievements/    # Achievement gallery
│   ├── analytics/       # Analytics dashboard
│   ├── campaigns/       # Campaign management
│   ├── dashboard/       # Main dashboard
│   ├── focus/           # Focus timer
│   ├── memory-lane/     # Memory Lane timeline
│   ├── missions/        # Mission CRUD
│   ├── settings/        # Settings (audio, appearance, notifications, privacy)
│   ├── workspace/       # 3D workspace (placeholder)
│   ├── providers.tsx    # Root providers (audio init, event subscriptions)
│   └── globals.css      # Global styles + glassmorphism utilities
├── assets/              # Static assets
├── audio/               # Audio engine (Web Audio API)
│   └── engine/
│       └── audio-engine.ts  # Core engine: 6 buses, 12 sounds, 6 ambients
├── components/          # Reusable UI components
├── core/                # Core infrastructure
│   ├── constants/       # XP values, achievements, themes, nav items
│   ├── events/          # Event bus (Pub/Sub), subscribers
│   └── types/           # All shared TypeScript types
├── database/            # Database layer
├── features/            # Feature-specific logic
├── hooks/               # Custom React hooks
├── lib/                 # Utilities (cn, formatDate, calculateLevel, etc.)
├── notifications/       # Notification service
├── services/            # Domain services
│   ├── achievements/    # Achievement checking & unlocking
│   ├── ai/              # Multi-provider AI orchestration
│   ├── analytics/       # Dashboard stats aggregation
│   ├── audio/           # Re-exports from audio/engine (alias)
│   ├── auth/            # Supabase Auth wrapper
│   ├── campaigns/       # Campaign CRUD + progress
│   ├── focus/           # Focus session management
│   ├── memory-lane/     # Timeline entries
│   ├── missions/        # Mission CRUD + history
│   ├── notifications/   # Notification CRUD
│   ├── rewards/         # Reward orchestration
│   ├── streaks/         # Daily streak tracking
│   ├── workspace/       # Workspace progression
│   └── xp/              # XP calculation & leveling
└── store/               # Zustand stores
    ├── achievement-store.ts
    ├── app-store.ts
    ├── audio-store.ts
    ├── campaign-store.ts
    ├── focus-store.ts
    ├── mission-store.ts
    └── xp-store.ts
```

### 1.2 Engine Architecture (Event-Driven)

```
User Action → Service Layer → Event Bus → Subscribers
                                            ├── Audio Engine (play sound)
                                            ├── Reward Service (award XP)
                                            ├── Streak Service (update streak)
                                            ├── Achievement Service (check unlock)
                                            ├── Notification Service (create)
                                            └── Memory Lane Service (add entry)
```

All engines communicate exclusively through the centralized `EventBus` (Pub/Sub). No service directly calls another — they emit events and react to them.

---

## 2. Priority 1 — Audio Engine Integration (COMPLETED)

### 2.1 Pre-Audit State

| File | Lines | Status |
|------|-------|--------|
| `src/audio/engine/audio-engine.ts` | 172 | Real engine — 1 master bus, 8 sine-wave sounds, stub ambient |
| `src/services/audio/audio-engine.ts` | 133 | **Stub** — console.log only, no Web Audio API usage |
| `src/services/audio/index.ts` | 1 | Exported the stub engine |
| `src/store/audio-store.ts` | 62 | Talked to the **wrong** engine (stub) |
| `src/app/providers.tsx` | 20 | Initialized the **correct** engine |
| `src/core/events/event-bus.ts` | 48 | Only had `subscribe`/`emit`/`clear` |

### 2.2 Problem

The audio system had **two competing engines** — a real one in `audio/engine/` and a console.log stub in `services/audio/`. The Zustand store imported the stub, so all volume sliders and ambient controls were no-ops. Sound effects only played through `providers.tsx` directly calling the real engine.

### 2.3 Changes Made

| File | Action | Description |
|------|--------|-------------|
| `src/audio/engine/audio-engine.ts` | **Rewritten** (172→461 lines) | 6-bus architecture, 12 procedural sounds, 6 ambient environments |
| `src/services/audio/audio-engine.ts` | **Deleted** | Removed console.log stub |
| `src/services/audio/index.ts` | **Updated** | Now re-exports from `@/audio/engine/audio-engine` |
| `src/store/audio-store.ts` | **Rewritten** (62→82 lines) | 6 bus volumes, sound profiles, ambient select, premium flags |
| `src/core/events/event-bus.ts` | **Updated** (48→69 lines) | Added `on`, `off`, `once` methods |
| `prisma/schema.prisma` | **Updated** | Added `voiceVolume`, `uiVolume`, `focusModeVolume`, `activeProfile`, `premiumPacks` |
| `src/app/(app)/settings/page.tsx` | **Rewritten** (200→250 lines) | 6 volume sliders, profile grid, ambient selector, sound preview, premium upsell |
| `src/app/(app)/focus/page.tsx` | **Updated** | Ambient dropdown selector, auto-start on deep_focus, auto-stop on end |

### 2.4 Post-Audit State

#### Audio Engine (`src/audio/engine/audio-engine.ts`)

**6-Bus Routing:**
```
AudioContext → Master → Music
                      → SFX
                      → Ambient
                      → Voice
                      → UI
```
Each bus has an independent `GainNode` with smooth `linearRampToValueAtTime` transitions (50ms fade).

**12 Procedural Sound Effects:**

| Sound | Type | Frequencies | Bus | Duration |
|-------|------|-------------|-----|----------|
| `mission_complete` | Sine arpeggio | C5→E5→G5 | sfx | 0.4s |
| `level_up` | Sine fanfare | A4→C#5→E5→A5 | sfx | 0.6s |
| `achievement` | Sine triumph | C5→E5→G5→C6 | sfx | 0.5s |
| `xp_gain` | Sine quick 3-note | A4→C#5→E5 | sfx | 0.25s |
| `focus_start` | Triangle descend | E4→A3 | sfx | 1.5s |
| `focus_end` | Triangle ascend | A3→E4→A4 | sfx | 0.8s |
| `capsule_open` | Sine 5-note rise | G4→C5→E5→G5→C6 | sfx | 0.5s |
| `streak_updated` | Sine 3-note | A4→C#5→E5 | sfx | 0.35s |
| `campaign_complete` | Sine 7-note scale | C4→E4→G4→C5→E5→G5→C6 | sfx | 0.56s |
| `daily_briefing` | Sine 3-note | C5→E5→G5 | sfx | 0.3s |
| `workspace_upgrade` | Sawtooth 3-note | F4→F5→C6 | sfx | 0.2s |
| `notification` | Sine double tap | G5→C6 | ui | 0.2s |

**6 Ambient Environments:**

| Environment | Noise Type | Filter | Special | Premium? |
|-------------|-----------|--------|---------|----------|
| `focus_deep` | Brown noise | Lowpass 300Hz | +432Hz sine drone | No |
| `focus_light` | White noise | Bandpass 800Hz | +528Hz sine drone | No |
| `rain` | White noise | Highpass 2kHz | LFO 0.3Hz modulation | No |
| `forest` | White noise | Bandpass 500Hz | Random chirps every 4s | No |
| `ocean` | White noise | Lowpass 600Hz | LFO 0.08Hz modulation | No |
| `cafe` | White noise | Bandpass 1.5kHz | Random clatter 30% chance/3s | Yes |

#### Event Bus (`src/core/events/event-bus.ts`)

| Method | Description |
|--------|-------------|
| `subscribe(event, handler)` | Alias for `on` — returns unsubscribe fn |
| `on(event, handler)` | Subscribe with handler, returns unsubscribe fn |
| `off(event, handler)` | Remove a specific handler by reference |
| `once(event, handler)` | Fire handler once then auto-unsubscribe |
| `emit(event)` | Fire all handlers for event type (async) |
| `clear()` | Remove all handlers |

#### Prisma AudioPreference Schema

```
model AudioPreference {
  id                 String   @id
  userId             String   @unique
  masterVolume       Float    @default(0.8)
  musicVolume        Float    @default(0.7)
  sfxVolume          Float    @default(0.8)
  ambientVolume      Float    @default(0.5)
  voiceVolume        Float    @default(0.8)     ← NEW
  uiVolume           Float    @default(0.6)     ← NEW
  focusModeVolume    Float    @default(0.3)     ← NEW
  activeProfile      String   @default("default") ← NEW
  currentEnvironment String?
  premiumPacks       String[] @default([])      ← NEW
  customSettings     Json?
  createdAt          DateTime
  updatedAt          DateTime
}
```

#### Sound Profiles (UI)

| Profile | Description |
|---------|-------------|
| Default | Balanced sound effects |
| Subtle | Gentle, minimal sounds |
| Intense | Bold, epic feedback |
| Premium | Studio-quality soundscape (locked) |

---

## 3. Development Roadmap

### 3.1 Legend

| Icon | Meaning |
|------|---------|
| ✅ | Completed |
| 🔄 | In Progress |
| ⏳ | Pending |
| ❌ | Blocked |

### 3.2 Priority 1 — Audio System (COMPLETED ✅)

| # | Task | Status | Files Touched |
|---|------|--------|---------------|
| 1.1 | Delete stub engine, wire store to real engine | ✅ | `services/audio/audio-engine.ts` (del), `services/audio/index.ts` |
| 1.2 | Multi-bus routing (master + 5 sub-buses) | ✅ | `audio/engine/audio-engine.ts` |
| 1.3 | 12 procedural sound effects | ✅ | `audio/engine/audio-engine.ts` |
| 1.4 | 6 ambient environments (procedural) | ✅ | `audio/engine/audio-engine.ts` |
| 1.5 | VolumeController API (get/set per bus) | ✅ | `audio/engine/audio-engine.ts` |
| 1.6 | SoundProfileManager + 4 profiles | ✅ | `store/audio-store.ts` |
| 1.7 | AudioStore expansion (6 buses, profiles, ambient) | ✅ | `store/audio-store.ts` |
| 1.8 | Prisma AudioPreference new fields | ✅ | `prisma/schema.prisma` |
| 1.9 | Settings page — profile selector, environments, preview | ✅ | `app/(app)/settings/page.tsx` |
| 1.10 | Connect ambient to focus page | ✅ | `app/(app)/focus/page.tsx` |
| 1.11 | Event bus `on`/`off`/`once` | ✅ | `core/events/event-bus.ts` |
| 1.12 | Remove dead Howler.js | ✅ | `package.json` |

### 3.3 Priority 2 — Core Features & Infrastructure

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | **Auth integration** — wire Supabase signup/login/logout to real auth | ⏳ | Auth service exists, pages exist, but API routes need connecting |
| 2.2 | **Prisma migrations** — generate initial migration, apply to DB | ⏳ | Schema is complete, needs `npx prisma migrate dev` |
| 2.3 | **Service → DB wiring** — connect all services to Prisma queries | ⏳ | All services return mock/in-memory data; need DB reads/writes |
| 2.4 | **RLS enforcement** — verify Supabase Row Level Security policies work | ⏳ | SQL file exists, needs testing with real auth |
| 2.5 | **Workspace 3D** — implement Three.js workspace visualization | ⏳ | `app/workspace/` is placeholder, `@react-three/fiber` installed |
| 2.6 | **Command palette** — implement ⌘K global search | ⏳ | Component exists in providers, needs logic |

### 3.4 Priority 3 — AI Features

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | **AI Planning** — wire AI service to UI (goal breakdown, daily plan) | ⏳ | AI service has prompt templates, needs UI integration |
| 3.2 | **Coaching engine** — contextual motivational messages | ⏳ | Prompt templates exist |
| 3.3 | **Smart mission generation** — auto-create missions from goals | ⏳ | `ai/mission-gen` route exists |
| 3.4 | **Voice coaching** — TTS integration for audio bus `voice` | ⏳ | Voice bus is ready, need TTS provider |

### 3.5 Priority 4 — Premium & Monetization

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | **Premium audio** — unlock Ocean/Café environments + Premium profile | ⏳ | Flagged in store, needs payment flow |
| 4.2 | **Premium themes** — exclusive workspace themes | ⏳ | |
| 4.3 | **Analytics exports** — CSV/PDF of mission and focus data | ⏳ | |
| 4.4 | **Memory Lane "Year in Review"** — annual wrapped report | ⏳ | Service has method, needs UI |

### 3.6 Priority 5 — Polish & Performance

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | **Animations** — Framer Motion page transitions, micro-interactions | ⏳ | Framer Motion installed, minimal usage |
| 5.2 | **Loading states** — skeleton screens for all pages | ⏳ | |
| 5.3 | **Error boundaries** — global + per-page error handling | ⏳ | |
| 5.4 | **Responsive** — mobile layout for all pages | ⏳ | Sidebar collapses on small screens needed |
| 5.5 | **Lighthouse audit** — target 95+ performance | ⏳ | |
| 5.6 | **PWA** — offline support, service worker | ⏳ | |
| 5.7 | **E2E tests** — Playwright test suite | ⏳ | Playwright installed |
| 5.8 | **Unit tests** — Vitest for services and stores | ⏳ | Vitest installed |

### 3.7 Future / Nice-to-Have

| # | Task | Notes |
|---|------|-------|
| 6.1 | Real-time collaboration (shared campaigns) | Requires WebSockets/Supabase Realtime |
| 6.2 | Mobile app (React Native / Expo) | API layer ready |
| 6.3 | Browser extension (quick-add missions) | |
| 6.4 | Calendar integration (Google Calendar sync) | |
| 6.5 | Gamification — seasonal events, leaderboards | |
| 6.6 | Habit tracker — recurring missions | |

---

## 4. Architecture Decisions & Conventions

### 4.1 Audio Engine Design

- **Procedural audio** over pre-recorded samples (no asset loading, instant playback, infinite variety)
- **6-bus routing** for independent volume control of different audio categories
- **Singleton pattern** (`AudioEngineImpl` via exported instance) — single AudioContext per session
- **Event-driven** — engine subscribes to `EventBus`, never called directly from domain logic
- **Smooth transitions** — all volume changes use `linearRampToValueAtTime` (50ms) to avoid clicks

### 4.2 Event Bus Design

- **Centralized Pub/Sub** — all cross-module communication goes through EventBus
- **Async handlers** — `emit()` awaits all handlers with `Promise.allSettled` (one failure doesn't block others)
- **Auto-cleanup** — `subscribe`/`on` return an unsubscribe function
- **Memory-safe** — `off()` uses reference equality for removal; `once()` auto-removes after first fire

### 4.3 Naming Conventions

- Services: singular file names (`mission-service.ts`), plural directory names (`services/missions/`)
- Stores: hyphenated with `-store` suffix (`audio-store.ts`)
- Types: `PascalCase` for interfaces, `camelCase` for enums
- Events: `UPPER_SNAKE_CASE` for event types (`MISSION_COMPLETED`, `LEVEL_UP`)

### 4.4 Avoiding Duplication

- **calculateLevel** exists in both `lib/utils.ts` and `services/xp/xp-service.ts` — keep both: utils for client-side display, service for server-side authoritative calc
- **TypeScript types** centralized in `core/types/index.ts` — never redefine types per service

---

## 5. File Inventory

### 5.1 Core (13 files)

| Path | Lines | Purpose |
|------|-------|---------|
| `src/core/types/index.ts` | 172 | All shared types |
| `src/core/events/event-bus.ts` | 69 | Pub/sub event bus |
| `src/core/events/index.ts` | 1 | Re-exports |
| `src/core/events/subscribers.ts` | 34 | Wiring: events → services |
| `src/core/constants/index.ts` | ~200 | XP values, achievements, focus, themes, nav |

### 5.2 Audio (1 file)

| Path | Lines | Purpose |
|------|-------|---------|
| `src/audio/engine/audio-engine.ts` | 461 | Full audio engine (6 buses, 12 sounds, 6 ambients) |

### 5.3 Services (14 directories)

| Path | Purpose |
|------|---------|
| `src/services/achievements/` | Achievement checking + unlocking |
| `src/services/ai/` | Multi-provider AI (OpenAI, Anthropic, Gemini) |
| `src/services/analytics/` | Dashboard stats aggregation |
| `src/services/audio/` | Re-exports from `audio/engine` |
| `src/services/auth/` | Supabase Auth wrapper |
| `src/services/campaigns/` | Campaign CRUD + progress |
| `src/services/focus/` | Focus session CRUD |
| `src/services/memory-lane/` | Timeline entries |
| `src/services/missions/` | Mission CRUD + history |
| `src/services/notifications/` | Notification CRUD |
| `src/services/rewards/` | XP + streak + achievement orchestration |
| `src/services/streaks/` | Daily streak tracking |
| `src/services/workspace/` | Workspace progression |
| `src/services/xp/` | XP calculation + leveling |

### 5.4 Stores (7 files)

| Path | Purpose |
|------|---------|
| `src/store/achievement-store.ts` | Achievement UI state |
| `src/store/app-store.ts` | App-level state |
| `src/store/audio-store.ts` | Audio state + engine bridge |
| `src/store/campaign-store.ts` | Campaign UI state |
| `src/store/focus-store.ts` | Focus timer state |
| `src/store/mission-store.ts` | Mission UI state |
| `src/store/xp-store.ts` | XP display state |

### 5.5 Pages (14 routes)

| Route | Type | Title |
|-------|------|-------|
| `/` | Static | Landing page |
| `/login` | Static | Login |
| `/register` | Static | Register |
| `/dashboard` | Static | Main dashboard |
| `/missions` | Static | Mission list + CRUD |
| `/campaigns` | Static | Campaign list + CRUD |
| `/focus` | Static | Focus timer |
| `/achievements` | Static | Achievement gallery |
| `/analytics` | Static | Analytics dashboard |
| `/memory-lane` | Static | Memory timeline |
| `/settings` | Static | Settings (4 tabs) |
| `/auth/callback` | Static | OAuth callback |
| `/api/auth/callback` | Dynamic | Auth API route |
| `/_not-found` | Static | 404 |

---

## 6. Quick Reference

### 6.1 Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build + type check
npx prisma migrate dev --name init   # Create DB migration
npx prisma generate  # Regenerate Prisma client
```

### 6.2 Key Patterns

**Adding a new sound effect:**
1. Add the name to `SoundName` type in `audio/engine/audio-engine.ts`
2. Add a `case` in `playEffect()` with oscillator frequencies
3. (Optional) Add event subscription in `setupEventSubscriptions()`
4. The store's `playEffect` will call it automatically

**Adding a new ambient environment:**
1. Add the name to `AmbientType` type
2. Add a `case` in `startAmbient()` with noise buffer + filter config
3. Add to `AMBIENT_ENVIRONMENTS` in `store/audio-store.ts`
4. It appears in the settings and focus page selectors automatically

**Adding a new event type:**
1. Add to `AppEvent` union in `core/types/index.ts`
2. Register handler in `subscribers.ts`
3. Emit from service with `eventBus.emit()`

### 6.3 RLS Policy File

Located at `prisma/rls.sql` — contains SELECT/INSERT/UPDATE/DELETE policies for all 18 tables with `auth.uid()` scoping.
