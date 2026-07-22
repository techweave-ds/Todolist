# Architecture — Deep Dive

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                             │
│                                                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌───────────────┐   │
│  │  Pages   │──>│  Stores  │──>│  Server  │──>│  Supabase SDK  │   │
│  │ (React)  │   │ (Zustand)│   │ Actions  │   │  (auth only)   │   │
│  └──────────┘   └──────────┘   └──────────┘   └───────┬───────┘   │
│       │               │               │                │           │
│       │               │        ┌──────┘                │           │
│       ▼               ▼        ▼                       ▼           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     EventBus (Pub/Sub)                      │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │   │
│  │  │ Subscribers │  │ Audio Engine │  │ (future: webhook) │  │   │
│  │  └─────────────┘  └──────────────┘  └───────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     NEXT.JS SERVER                                   │
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐   │
│  │  Server      │    │  Prisma      │    │  AI Engine            │   │
│  │  Actions     │───>│  Client      │    │  ┌────────────────┐  │   │
│  │  (actions.ts)│    │  (singleton) │    │  │ Groq Provider  │  │   │
│  └──────────────┘    └──────┬───────┘    │  ├────────────────┤  │   │
│                             │            │  │ OpenAI Prov.   │  │   │
│  ┌──────────────┐           │            │  ├────────────────┤  │   │
│  │  Proxy       │           │            │  │ Anthropic Prov.│  │   │
│  │  (auth guard)│           ▼            │  ├────────────────┤  │   │
│  └──────────────┘    ┌──────────────┐    │  │ Gemini Prov.   │  │   │
│                      │  PostgreSQL  │    │  └────────────────┘  │   │
│                      │  (Supabase)  │    └──────────────────────┘   │
│                      └──────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                               │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Supabase │  │ Groq     │  │ OpenAI   │  │Anthropic │  Gemini    │
│  │ Auth     │  │ API      │  │ API      │  │ API      │  API       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Patterns

### 2.1 Standard Read Flow

```
Page mounts
  → useEffect with [userId] dependency
    → Store.fetchData(userId)
      → Server Action (actions.ts)
        → getAuthUserId() — validates session
        → Service.getByUser(userId)
          → prisma.findMany/findUnique
        → Returns result
      → Store updates state
    → Page re-renders with data
```

### 2.2 Standard Write Flow

```
User clicks/submits
  → Store.create/update/delete(input, userId)
    → Server Action (actions.ts)
      → getAuthUserId() — validates session
      → Service.create/update/delete(input, userId)
        → prisma.create/update/delete
        → eventBus.emit(event) — server-side
      → Returns result
    → Store optimistically updates local state
    → eventBus.emit(event) — client-side
      → audioEngine plays feedback sound
```

### 2.3 Mission Completion Flow (most complex)

```
User clicks checkbox
  → missionStore.completeMission(id, userId)
    → completeMissionAction(id, userId)
      → missionService.complete(id, userId)
        → missionService.update(id, { status: 'completed' })
          → prisma.mission.update
          → prisma.missionHistory.create
          → eventBus.emit(MISSION_COMPLETED) — server side
        → rewardService.processMissionCompletion(userId, id, difficulty)
          → xpService.awardXP()
            → prisma.$transaction:
              → create XPTransaction
              → aggregate total XP
              → calculateLevel(totalXP)
              → fetch previousProgress (BEFORE upsert)
              → upsert UserProgress
              → emit XP_GAINED
              → if leveled: emit LEVEL_UP
          → streakService.updateStreak()
            → upsert Streak
            → emit STREAK_UPDATED if changed
          → achievementService.checkAndUnlock()
            → evaluate 11 conditions against DB
            → unlock eligible, update progress on others
            → if unlocked: emit ACHIEVEMENT_UNLOCKED
          → Create notification for level up
          → Create memory lane entry for level up
          → Create notification for achievement
          → Create memory lane entry for achievement
          → Increment totalMissionsCompleted
          → emit REWARD_CAPSULE_OPENED
    → Store emits client-side events:
      → MISSION_COMPLETED → audio: mission_complete
      → XP_GAINED → audio: xp_gain
      → REWARD_CAPSULE_OPENED → audio: capsule_open
      → LEVEL_UP → audio: level_up + notification + memory lane
      → ACHIEVEMENT_UNLOCKED → audio: achievement
      → STREAK_UPDATED → audio: streak_updated
    → Store updates missions array
    → Page shows XP float animation
```

---

## 3. Event Bus Architecture

The EventBus is a singleton Pub/Sub system that enables loose coupling between modules.

### 3.1 Implementation

```typescript
class EventBus {
  private handlers: Map<string, Map<HandlerId, EventHandler>>
  
  subscribe(eventType, handler) → unsubscribe function
  on(eventType, handler) → same as subscribe
  off(eventType, handler) → remove by reference
  once(eventType, handler) → auto-removes after first fire
  emit(event: AppEvent) → async, allSettled
  clear() → removes all handlers
}
```

### 3.2 All Event Types

| Category | Events | Payload |
|----------|--------|---------|
| Mission | `MISSION_CREATED`, `MISSION_UPDATED`, `MISSION_COMPLETED`, `MISSION_DELETED` | `{ missionId, userId, data? }` |
| Campaign | `CAMPAIGN_CREATED`, `CAMPAIGN_UPDATED`, `CAMPAIGN_COMPLETED` | `{ campaignId, userId, data? }` |
| XP | `XP_GAINED`, `LEVEL_UP` | `{ userId, amount, totalXP, level, data? }` |
| Achievement | `ACHIEVEMENT_UNLOCKED` | `{ userId, achievementKey, achievementTitle, data? }` |
| Streak | `STREAK_UPDATED` | `{ userId, currentStreak, longestStreak, data? }` |
| Focus | `FOCUS_STARTED`, `FOCUS_ENDED` | `{ userId, sessionId, duration, completed, data? }` |
| App | `DAILY_BRIEFING_OPENED`, `REWARD_CAPSULE_OPENED` | `{ userId, data? }` |

### 3.3 Event → Subscriber Mapping

| Event | Audio Subscriber | Business Logic |
|-------|-----------------|----------------|
| MISSION_CREATED | `notification` sound | analyticsService.trackEvent |
| MISSION_UPDATED | — | analyticsService.trackEvent |
| MISSION_COMPLETED | `mission_complete` sound | RewardService (direct call) |
| MISSION_DELETED | `notification` sound | analyticsService.trackEvent |
| CAMPAIGN_CREATED | `notification` sound | analyticsService.trackEvent |
| CAMPAIGN_UPDATED | — | analyticsService.trackEvent |
| CAMPAIGN_COMPLETED | `campaign_complete` sound | analyticsService.trackEvent |
| XP_GAINED | `xp_gain` sound | — |
| LEVEL_UP | `level_up` sound | NotificationService + MemoryLaneService |
| ACHIEVEMENT_UNLOCKED | `achievement` sound | NotificationService + MemoryLaneService |
| STREAK_UPDATED | `streak_updated` sound | — |
| FOCUS_STARTED | `focus_start` sound | analyticsService.trackEvent |
| FOCUS_ENDED | `focus_end` sound | analyticsService.trackEvent, NotificationService, MemoryLaneService |
| REWARD_CAPSULE_OPENED | `capsule_open` sound | — |
| DAILY_BRIEFING_OPENED | — | — |

---

## 4. Authentication Architecture

### 4.1 Three Auth Modes (fallback chain)

1. **Demo Mode** — Cookie `demo_mode=true` → reads `DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'`
2. **Local Auth** — Cookie `local_user_id=<id>` → authenticates via Prisma User table
3. **Supabase Auth** — OAuth providers (Google, GitHub), magic link, email/password

### 4.2 Auth Guard (`src/proxy.ts`)

```typescript
// If no demo cookie, no local user cookie, and Supabase not configured:
//   → redirect to /login
// If authenticated:
//   → redirect /login and /register to /dashboard
// Public routes: /, /login, /register, /auth/callback, /demo, /api/*
```

### 4.3 Session Initializer (`src/components/auth/session-initializer.tsx`)

Runs on mount:
1. Checks Supabase session
2. Reads cookies for demo/local auth
3. Calls `ensureUserProfile(userId)` server action (creates Profile + UserProgress + AudioPreference if first visit)
4. Sets `userId` in app-store

---

## 5. Module Dependency Graph

```
Pages ──→ Stores ──→ Server Actions ──→ Services ──→ Prisma
  │                                        │
  │                                        ▼
  └──→ Components ──→ UI primitives    EventBus
                         ↓              Audio Engine
                     Audio Store
```

Key principle: **Stores never call Prisma directly** — they always go through server actions. Services never call other services directly for business flow — the reward service is the orchestrator for cross-cutting operations.

---

## 6. State Management Strategy

- **Zustand stores** manage all client-side state (11 stores)
- **Server actions** are the sole bridge between client and server
- **No API routes for CRUD** — all data mutations go through server actions (Next.js convention over REST)
- **3 API routes only** for: health check, audio preferences (GET/POST), auth callback
- **Notifications poll every 30 seconds** via `useNotificationPoll` hook
- **No WebSockets** — real-time updates are not implemented (polling only)

---

## 7. Error Handling Strategy

- All service methods wrapped in try/catch with `handleServiceError(error, methodName)`
- `ServiceError` class preserves original error message
- Server actions catch and return `{ error: string }` instead of throwing
- Stores set `error` state field on failure
- Pages display error state via `<div className="glass rounded-xl p-3 text-sm text-red-400">`
- Global error boundary at `src/app/global-error.tsx`
- Mission completion rewards failure is non-fatal (caught and logged individually)

---

## 8. Styling Architecture

- **Tailwind CSS 4** with PostCSS
- **Dark mode default** — `<html className="dark">`
- **Glassmorphism** — `glass` utility class applied to cards, inputs, dialogs
- **Framer Motion** — `AnimatePresence` page transitions (fade + slide), component animations
- **Custom themes** — 6 theme presets (neon-dreams, deep-space, midnight-ocean, aurora, cyber-synth, minimal-light)
- **Responsive** — sidebar collapses on small screens (CSS-based)
