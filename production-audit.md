# Production Readiness Audit — Mission Control OS

**Auditor:** Principal Architect
**Date:** 2026-06-03
**Build:** 16 static routes, zero TS errors, proxy recognized

---

## Feature Readiness Assessment

| Feature | Status | Evidence |
|---------|--------|----------|
| 1. Authentication | 🔴 **Non Functional** | Proxy.ts routes correctly. auth-service wraps Supabase SDK. But `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are placeholder values. No real Supabase project connected. All auth flows (login, register, OAuth, magic link) will fail at runtime. |
| 2. Session Management | 🟡 **Partially Functional** | SessionInitializer reads session and subscribes to auth state changes. userId propagated to app-store. But there's a guaranteed async gap between first render and `getSession()` resolution where `userId = null`. Focus page lacks `userId` in deps — fetches for `'demo-user'` even when logged in. DailyBriefing guard prevents re-fetch for real user. |
| 3. User Scoping | 🟡 **Partially Functional** | Most pages now read `userId` from app-store (fixed in this session). All services accept `userId` parameter. RLS SQL defined in `prisma/rls.sql`. But RLS has never been applied (no migration). Services don't verify row ownership — a compromised client could pass another user's ID. No application-layer authorization. |
| 4. Prisma Integration | 🔴 **Non Functional** | Singleton client pattern is correct. All 14 DB-service files import `@/lib/prisma`. But **zero Prisma calls across 14 service files have try/catch error handling**. If the database is unreachable, every page crashes. `DATABASE_URL` is `localhost` placeholder. No migration has ever been run — database doesn't exist. `npx prisma generate` succeeds but `npx prisma migrate dev` would fail. |
| 5. Server Actions | 🟡 **Partially Functional** | `src/app/actions.ts` defines 4 server actions: `createMission`, `completeMission`, `deleteMission`, `createCampaign`. `ensureUserProfile` added this session. But only `ensureUserProfile` is ever called (by SessionInitializer). The 4 CRUD actions are defined but never imported by any page — pages bypass actions and call stores/services directly. |
| 6. Database Persistence | 🔴 **Non Functional** | All write paths go to Prisma. Event subscribers chain operations (reward→xp→streak→achievements). But **no transaction wrapping** — if `xpService.awardXP()` succeeds but `streakService.updateStreak()` fails mid-chain, there's no rollback. Data ends in an inconsistent state. No retry logic. No connection pooling. |
| 7. Event Flows | 🟡 **Partially Functional** | EventBus uses `Promise.allSettled` — correct for fault isolation. 14 events emitted, 11 registered subscribers. `LEVEL_UP` bug fixed this session. Double-processing in `MISSION_COMPLETED` fixed this session. But 5 events are dead emissions (no subscribers). 6 events have audio-only subscribers (no business logic). No dead-letter queue. No event persistence (events lost on server restart). |
| 8. Store Synchronization | 🟡 **Partially Functional** | 10 Zustand stores defined. Dashboard, Analytics, Memory Lane, Achievements, Workspace re-fetch on mount with `userId` dependency. But **Missions and Campaigns pages never call fetch** — they read from empty store state forever. Focus page lacks `userId` in useEffect deps. 5/10 stores silently swallow errors (no error state). No data staleness management (no TTL, no background refresh). No request deduplication or cancellation (AbortController). |
| 9. Audio Persistence | 🔴 **Non Functional** | `loadPreferences(userId)` and `savePreferences(userId)` methods exist in audio-store. Schema has `AudioPreference` model with all fields. But neither method is ever called from any page. Audio settings changes are in-memory only — lost on page refresh. |
| 10. Analytics Tracking | 🔴 **Non Functional** | `analyticsService.trackEvent()` defines the method. `AnalyticsEvent` table exists in schema. But `trackEvent()` is never called from any service, store, or page. The `AnalyticsEvent` table is never written to — it's dead schema. Query methods (`getDashboardStats`, `getMissionCompletionRate`, etc.) work correctly using other tables. |

**Overall Production Readiness Score: 3/10**

---

## User Journey Traces

### Journey 1: New User Registration

```
User → /register (page) → authService.register(email, password, name)
  → supabase.auth.signUp() → [SUPABASE] creates auth.users
  → [BROWSER] auth state change fires
  → SessionInitializer.onAuthStateChange('SIGNED_IN')
    → setUserId(session.user.id)                 [app-store]
    → ensureUserProfile(userId, displayName)       [server action]
      → prisma.profile.create({ userId, displayName })
      → prisma.userProgress.create({ userId, ... })
      → prisma.audioPreference.create({ userId })
  → Proxy redirects to /dashboard
  → Dashboard mounts
    → fetchDashboardStats(userId)                 [app-store]
      → analyticsService.getDashboardStats(userId)
        → prisma.mission.findMany()               [🚨 NO TRY/CATCH]
        → prisma.userProgress.findUnique()
        → prisma.streak.findMany()
        → prisma.focusStatistic.findUnique()
        → prisma.userAchievement.findMany()
        → prisma.campaign.findMany()
    → fetchLevelInfo(userId)                      [xp-store]
      → xpService.getLevelInfo(userId)
        → prisma.userProgress.findUnique()        [🚨 NO TRY/CATCH]
    → getMotivation(userId)                       [ai-store]
      → aiService.getMotivation(userId)
        → aiEngine.getMotivation(userId)
          → prisma.streak.findUnique()            [🚨 NO TRY/CATCH]
          → prisma.userProgress.findUnique()
          → OPENAI/ANTHROPIC/GEMINI API call      [🚨 NO API KEY → empty content]

PRODUCTION BLOCKERS:
- [HARD] Supabase credentials are placeholders → auth fails at step 2
- [HARD] DATABASE_URL is localhost → all Prisma calls fail at step 7
- [HARD] No AI API keys configured → motivation returns empty string
- [MEDIUM] If any Prisma call fails, the entire page crashes with 500
```

### Journey 2: User Login

```
User → /login (page) → authService.loginWithEmail(email, password)
  → supabase.auth.signInWithPassword() → [SUPABASE] validates
  → SessionInitializer → setUserId(userId)
  → ensureUserProfile(userId)   [no-op if records exist]
  → Proxy redirects /login → /dashboard
  → Dashboard: fetchDashboardStats + fetchLevelInfo + getMotivation

PRODUCTION BLOCKERS:
- Same as Journey 1: placeholder Supabase creds, placeholder DB, no AI keys
```

### Journey 3: Create Mission

```
User → /missions (page) → clicks "New Mission" → form submit
  → missionStore.createMission(input, userId)
    → missionService.create(input, userId)
      → prisma.mission.create({ ... })            [🚨 NO TRY/CATCH]
      → prisma.missionHistory.create({ ... })
      → eventBus.emit(MISSION_CREATED)
        → [NO SUBSCRIBER — dead event]

PRODUCTION BLOCKERS:
- [HARD] Prisma unreachable → crash at step 3
- [LOW] MISSION_CREATED has no subscriber — no notification, no first-mission achievement
```

### Journey 4: Complete Mission

```
User → clicks checkbox → missionStore.completeMission(id, userId)
  → missionService.complete(id, userId)
    → prisma.mission.update({ status: 'completed' })
    → prisma.missionHistory.create({ action: 'completed' })
    → eventBus.emit(MISSION_COMPLETED)
      → Subscriber: rewardService.processMissionCompletion(userId, missionId, diff)
        → xpService.awardXP(userId, xpAmount, 'mission_complete', missionId)
          → prisma.xPTransaction.create({ ... })
          → prisma.xPTransaction.aggregate({ _sum: amount })
          → calculateLevel(totalXPAmount)
          → prisma.userProgress.findUnique({ userId })     [before upsert — FIXED]
          → prisma.userProgress.upsert({ ... })
          → eventBus.emit(XP_GAINED) → audio: 'xp_gain'    [no business logic sub]
          → if leveled: eventBus.emit(LEVEL_UP)
            → notificationService.create('Level X Reached!')
              → prisma.notification.create({ ... })
            → memoryLaneService.addEntry({ type: 'milestone' })
              → prisma.memoryLane.create({ ... })
            → audio: 'level_up'
        → [reward already called these internally — FIXED: removed from subscriber]
      → Subscriber: audioEngine.playEffect('mission_complete')

PRODUCTION BLOCKERS:
- [HARD] Prisma unreachable → crash at any of 7+ sequential DB calls
- [MEDIUM] No transaction — if XP succeeds but notification fails, no rollback
- [LOW] XP_GAINED has no business logic subscriber (no UI update triggered)
```

### Journey 5: Gain XP

```
Triggered by: mission completion, achievement unlock, focus session end
  → xpService.awardXP(userId, amount, reason, refId)
    → prisma.xPTransaction.create({ amount, reason })
    → prisma.xPTransaction.aggregate(_sum: amount)
    → calculateLevel(total)
    → prisma.userProgress.findUnique({ userId })    [before upsert — FIXED]
    → prisma.userProgress.upsert({ totalXP, level })
    → eventBus.emit(XP_GAINED)
      → audio: 'xp_gain'                             [🔊 sound only]
    → if level > previous:
      → eventBus.emit(LEVEL_UP)
        → notification + memory lane + audio

PRODUCTION BLOCKERS:
- [HARD] Prisma unreachable → crash
- [LOW] XP_GAINED has no business logic — no UI notification to user
```

### Journey 6: Level Up

```
Triggered by xpService.awardXP (when level crosses threshold)
  → eventBus.emit(LEVEL_UP)
    → notificationService.create(userId, 'system', 'Level X Reached!')
      → prisma.notification.create({ userId, type: 'system', title: 'Level X Reached!' })
    → memoryLaneService.addEntry(userId, 'milestone', 'Level X Reached!', ...)
      → prisma.memoryLane.create({ userId, type: 'milestone', ... })
    → audioEngine.playEffect('level_up')

PRODUCTION BLOCKERS:
- [HARD] Prisma unreachable → crash
- [MEDIUM] Notification persisted but never displayed to user (no notification UI component)
- [LOW] No animation/celebration UI when leveling up
```

### Journey 7: Unlock Achievement

```
Triggered by achievementService.checkAndUnlock(userId) after mission completion
  → Queries progress, streaks, achievements, focusStats, campaigns
  → If condition met:
    → prisma.achievement.upsert({ key, title, ... })
    → prisma.userAchievement.upsert({ userId, achievementKey, unlocked: true })
    → xpService.awardXP(userId, xpReward, 'achievement', key)
    → eventBus.emit(ACHIEVEMENT_UNLOCKED)
      → notificationService.create('achievement', 'Achievement Unlocked!')
        → prisma.notification.create({ ... })
      → memoryLaneService.addEntry('achievement', ...)
        → prisma.memoryLane.create({ ... })
      → audio: 'achievement'

PRODUCTION BLOCKERS:
- [HARD] Prisma unreachable → crash at step 2 (first query)
- [MEDIUM] Notification persisted but not displayed
```

### Journey 8: Create Campaign

```
User → /campaigns (page) → form submit
  → campaignStore.createCampaign(input, userId)
    → campaignService.create(input, userId)
      → prisma.campaign.create({ title, description, emoji, ... })
      → eventBus.emit(CAMPAIGN_CREATED)
        → [NO SUBSCRIBER — dead event]

PRODUCTION BLOCKERS:
- [HARD] Prisma unreachable → crash
- [NOTE] Campaigns page never fetches data on mount — shows empty state forever
```

### Journey 9: Start Focus Session

```
User → /focus (page) → selects mode → clicks Start
  → focusStore.startSession(input, userId)
    → focusService.startSession(input, userId)
      → prisma.focusSession.create({ type, duration, startedAt })
      → eventBus.emit(FOCUS_STARTED)
        → audio: 'focus_start'                        [🔊 sound only]
  → Timer starts (setInterval on client)
  → If deep_focus: audioEngine.startAmbient('focus_deep')

Session ends:
  → focusStore.endSession(sessionId, userId, duration, completed, distractions)
    → focusService.endSession(id, userId, ...)
      → prisma.focusSession.update({ actualDuration, completed, score })
      → prisma.focusStatistic.upsert({ totalSessions, totalMinutes, ... })
      → prisma.focusStatistic.findUnique()
      → prisma.focusSession.findMany()
      → prisma.focusSession.findFirst()
      → prisma.focusStatistic.update({ averageScore, longestSession })
      → eventBus.emit(FOCUS_ENDED)
        → audio: 'focus_end'

PRODUCTION BLOCKERS:
- [HARD] Prisma unreachable → crash
- [MEDIUM] Timer uses stale closure for timeRemaining
- [MEDIUM] endSession called inside timer effect — race condition
- [LOW] FOCUS_STARTED/ENDED have no business logic subscribers
```

### Journey 10: Change Audio Settings

```
User → /settings (page) → adjusts volume slider
  → audioStore.setBusVolume(bus, value)
    → audioEngine.setBusVolume(bus, value)           [in-memory only]
    → set({ volumes: { ...volumes, [bus]: value } })

User changes sound profile:
  → audioStore.setActiveProfile(profileId)
    → set({ activeProfile: profileId })

PRODUCTION BLOCKERS:
- [HARD] savePreferences() and loadPreferences() are NEVER called from any page
- [HARD] All audio settings lost on page refresh
- [NOTE] Settings page also has hardcoded themes, tabs, notification prefs — none persisted
```

### Journey 11: Generate AI Plan

```
User → clicks "Break Down Goal" button
  → GoalBreakdown dialog opens → user types goal → clicks Generate
  → aiStore.breakDownGoal(goal, userId)
    → aiService.breakDownGoal(goal, userId)
      → aiEngine.breakDownGoal(goal, userId)
        → aiEngine.generate(request, userId, 'goal_breakdown')
          → provider.generate(request)               [OpenAI/Anthropic/Gemini]
          → prisma.aIGeneration.create({ ... })       [🚨 NO TRY/CATCH]
        → JSON.parse(response.content)                [try/catch → fallback]
  → GoalBreakdown displays generated missions
  → User clicks "Create All" → missionStore.createMission() for each

Weekly Planner flow:
  → aiStore.generateWeeklyPlan(userId)
    → aiService.generateWeeklyPlan(userId)
      → aiEngine.generateWeeklyPlan(userId)
        → prisma.mission.findMany({ status: pending/active })  [🚨 NO TRY/CATCH]
        → prisma.campaign.findMany({ status: active })
        → provider.generate(...)
        → prisma.aIGeneration.create(...)
        → JSON.parse → fallback on failure

PRODUCTION BLOCKERS:
- [HARD] Prisma unreachable → crash before AI call
- [HARD] No real API keys → AI returns fallback (empty) content
- [MEDIUM] Anthropic provider doesn't catch HTTP-level errors (401/429/500) — treated as success
- [MEDIUM] AI calls are sequential — DB query, then provider call, then DB write. Slow.
```

---

## Critical Production Blockers

| # | Blocker | Severity | Affected Journeys |
|---|---------|----------|-------------------|
| 1 | **No real Supabase credentials** — `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are placeholders | 🔴 BLOCKING | 1, 2 (all auth) |
| 2 | **No real database** — `DATABASE_URL` is localhost placeholder. No migration ever run. No database exists. | 🔴 BLOCKING | 3-11 (all data operations) |
| 3 | **Zero try/catch on Prisma calls** — all 14 service files throw unhandled errors on DB failure. Every page crashes on DB error. | 🔴 CRITICAL | 3-11 |
| 4 | **No AI API keys** — `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` not set. AI features return empty fallback content. | 🔴 BLOCKING | 11 |
| 5 | **No transaction wrapping** — multi-step operations (mission completion → XP → streak → achievements) have no rollback. Partial failures corrupt data. | 🟠 HIGH | 4, 5, 6, 7 |
| 6 | **Notifications never displayed** — notifications are persisted to DB but no UI component reads or shows them. | 🟠 HIGH | 6, 7 |
| 7 | **Missions and Campaigns pages never fetch data** — no useEffect trigger. Pages show empty state forever. | 🟠 HIGH | 3, 8 |
| 8 | **Focus page missing userId dependency** — stats fetched for `'demo-user'` even when logged in. | 🟠 HIGH | 9 |
| 9 | **Audio preferences never persisted** — `savePreferences`/`loadPreferences` defined but never called. | 🟠 MEDIUM | 10 |
| 10 | **Anthropic provider blind to HTTP errors** — 401/429/500 treated as successful empty responses. | 🟠 MEDIUM | 11 |
| 11 | **6 audio-only events with no business logic** — XP_GAINED, FOCUS_STARTED, FOCUS_ENDED, STREAK_UPDATED, CAMPAIGN_COMPLETED, REWARD_CAPSULE_OPENED have no non-audio subscribers. | 🟡 LOW | 4, 5, 9 |
| 12 | **5 dead event emissions** — MISSION_CREATED, MISSION_UPDATED, MISSION_DELETED, CAMPAIGN_CREATED, CAMPAIGN_UPDATED have zero subscribers. | 🟡 LOW | 3, 8 |
| 13 | **AnalyticsEvent.trackEvent() never called** — event tracking is dead code. | 🟡 LOW | — |
| 14 | **Three hooks orphaned** — `useMissions`, `useCampaigns`, `useFocus` defined but never imported. | 🟡 LOW | — |
| 15 | **No request cancellation or deduplication** — parallel identical fetches possible (Dashboard + Workspace both call `fetchDashboardStats`). | 🟡 LOW | — |

---

## Missing Integrations

| Integration | Status | Required For |
|-------------|--------|-------------|
| Supabase project (real URL + anon key) | ❌ Missing | Auth, proxy, session management |
| PostgreSQL database (real connection string) | ❌ Missing | All data persistence |
| OpenAI API key | ❌ Missing | AI features |
| Anthropic API key | ❌ Missing | AI features (fallback) |
| Gemini API key | ❌ Missing | AI features (fallback) |
| Resend API key | ❌ Missing | Email (magic links, notifications) |
| Sentry DSN | ❌ Missing | Error monitoring |
| PostHog keys | ❌ Missing | Product analytics |
| Firebase credentials | ❌ Missing | Push notifications |
| Trigger.dev secret | ❌ Missing | Background jobs |
| Error boundary (React) | ❌ Missing | Graceful error handling |
| Toast/snackbar notification UI | ❌ Missing | Displaying notifications to user |
| Loading skeletons (most pages) | ❌ Missing | UX during data fetch |
| API routes for CRUD | ❌ Missing | Server-client data boundary |
| Database connection pooling | ❌ Missing | Production-scale DB access |
| Health check endpoint | ❌ Missing | Monitoring/uptime checks |

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                             │
│                                                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌───────────────┐   │
│  │  Pages   │──>│  Stores  │──>│ Services │──>│  Supabase SDK  │   │
│  │ (React)  │   │ (Zustand)│   │ (import) │   │  (auth only)   │   │
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
│  │  (actions.ts)│    │  (singleton) │    │  │ OpenAI Prov.   │  │   │
│  └──────────────┘    └──────┬───────┘    │  ├────────────────┤  │   │
│                             │            │  │ Anthropic Prov.│  │   │
│  ┌──────────────┐           │            │  ├────────────────┤  │   │
│  │  Proxy       │           │            │  │ Gemini Prov.   │  │   │
│  │  (auth guard)│           ▼            │  └────────────────┘  │   │
│  └──────────────┘    ┌──────────────┐    └──────────────────────┘   │
│                      │  PostgreSQL  │                               │
│                      │  (Supabase)  │                               │
│                      └──────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                               │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Supabase │  │ OpenAI   │  │Anthropic │  │ Gemini   │           │
│  │ Auth     │  │ API      │  │ API      │  │ API      │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
└─────────────────────────────────────────────────────────────────────┘

CRITICAL ARCHITECTURAL ISSUE:
Stores import and call Services that use Prisma directly. These Services 
run on the server, but are imported into Client Components. This works 
in Next.js SSR through tree-shaking (server code ends up in server bundle),
but after client navigation, subsequent store actions run server code 
inline via the server reference. This pattern is fragile and bypasses 
the API route layer entirely. There is no clear client-server boundary.
```

---

## Recommended Next Sprint

### Sprint Goal: "Make it run, not just build"

#### Day 1-2: Blocking Infrastructure
- [ ] Create real Supabase project, get URL + anon key → update `.env.local`
- [ ] Create real PostgreSQL database (Supabase provides this) → update `DATABASE_URL`
- [ ] Run `npx prisma migrate dev --name init` → create all 19 tables
- [ ] Apply RLS policies from `prisma/rls.sql` via Supabase SQL editor
- [ ] Configure real OpenAI API key (at minimum) → update `.env.local`

#### Day 3-4: Crash-Proof the Data Layer
- [ ] Wrap every `prisma.*` call in try/catch across all 14 service files — return typed fallbacks on error
- [ ] Add Prisma transaction wrapping to multi-step operations (`rewardService.processMissionCompletion`, `focusService.endSession`, `xpService.awardXP`)
- [ ] Add `response.ok` check to Anthropic provider — handle HTTP errors properly
- [ ] Add `AbortController` support to all store fetch actions

#### Day 5-6: Fix the Gaps
- [ ] Add `fetchMissions()` and `fetchCampaigns()` useEffect triggers to Missions/Campaigns pages
- [ ] Add `userId` to Focus page useEffect dependency array
- [ ] Fix DailyBriefing to re-fetch when userId changes
- [ ] Wire `audioStore.loadPreferences()` into SessionInitializer and `savePreferences()` into Settings page volume/profile change handlers
- [ ] Add error state UI to all stores that currently silently swallow errors
- [ ] Add React Error Boundary wrapper to app layout

#### Day 7-8: Notification & User Feedback
- [ ] Create notification UI component (toast/snackbar) that reads `prisma.notification` for current user
- [ ] Wire notification-store into app-store or create dedicated notification-store
- [ ] Add business logic subscribers for: XP_GAINED (toast), FOCUS_STARTED/ENDED (session summary), CAMPAIGN_COMPLETED (celebration), REWARD_CAPSULE_OPENED (reward card)
- [ ] Add loading skeletons to all pages

#### Day 9-10: Observability & Polish
- [ ] Configure Sentry for error tracking
- [ ] Add health check API route (`GET /api/health`) — returns DB connection status, auth status, AI provider health
- [ ] Add `trackEvent()` calls to meaningful user actions (mission create/complete, focus start/end, campaign create/complete)
- [ ] Delete orphaned hooks (`useMissions`, `useCampaigns`, `useFocus`, `useDebounce`) or wire them in
- [ ] Final integration test — run through all 11 user journeys end-to-end

### Deferred (Future Sprint)
- API routes for CRUD (architectural decision needs design discussion)
- Event persistence and dead-letter queue
- Connection pooling configuration (PgBouncer via Supabase)
- Client-side caching strategy (SWR/TanStack Query vs Zustand middlewares)
- E2E test suite (Playwright)
- PWA/service worker for offline support
