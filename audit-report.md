# Integration Audit Report — Mission Control OS

---

## 1. Services: Mock vs Prisma

| Service | Prisma Tables Used | Mock/Config Data | External API | Issues |
|---|---|---|---|---|
| `mission-service` | mission, missionHistory | — | — | ✅ |
| `campaign-service` | campaign | — | — | ✅ |
| `focus-service` | focusSession, focusStatistic | — | — | Unused `sessionId` param; redundant stats re-query |
| `xp-service` | xPTransaction, userProgress | `DIFFICULTY_XP` map (config) | — | **🐛 BUG**: `previousProgress` fetched *after* upsert — `LEVEL_UP` event **never fires** |
| `achievement-service` | userProgress, streak, userAchievement, focusStatistic, campaign, achievement | ACHIEVEMENTS (config) | — | ✅ |
| `streak-service` | streak | — | — | ✅ |
| `notification-service` | notification | — | — | ✅ |
| `reward-service` | userProgress, streak, userAchievement, xPTransaction | — | — | ✅ |
| `memory-lane-service` | memoryLane, mission, xPTransaction, focusSession | — | — | ✅ |
| `analytics-service` | analyticsEvent, mission, focusSession, xPTransaction, userProgress, streak, focusStatistic, userAchievement, campaign | — | — | ✅ |
| `workspace-service` | workspaceProgression | `getAvailableUpgrades` (config) | — | ✅ |
| `auth-service` | — (uses Supabase SDK) | — | Supabase Auth | Uses `@/lib/supabase` client |
| `ai-service` | aIGeneration | — | aiEngine (SDKs) | ✅ |

---

## 2. Pages: Data Source & Mock Usage

| Page | Data Fetched Via | Real Data Source | Mock/Hardcoded Data | User ID |
|---|---|---|---|---|
| `/` (landing) | *none* (server component) | — | Feature cards inline | N/A |
| `/dashboard` | app-store, mission-store, xp-store, achievement-store, ai-store | analyticsService → Prisma | Quick actions; fallback defaults | `'demo-user'` |
| `/missions` | mission-store | missionService → Prisma | priorityColors, difficultyLabels | `'demo-user'` |
| `/campaigns` | campaign-store | campaignService → Prisma | emojis array | `'demo-user'` |
| `/focus` | focus-store, audio-store | focusService → Prisma | FOCUS constants | `'demo-user'` |
| `/achievements` | achievement-store | achievementService → Prisma | rarityColors, ACHIEVEMENTS constants | `'demo-user'` |
| `/analytics` | **direct** analyticsService (no store) | analyticsService → Prisma | — | `'demo-user'` |
| `/memory-lane` | **direct** memoryLaneService (no store) | memoryLaneService → Prisma | typeIcons, typeColors | `'demo-user'` |
| `/settings` | audio-store (getters only) | audioEngine (in-memory) | tabs, themes, busLabels, soundEffects | N/A |
| `/workspace` | app-store | analyticsService → Prisma | Theme colors, upgrade strings | `'demo-user'` |
| `/login` | **direct** authService | Supabase Auth | — | N/A |
| `/register` | **direct** authService | Supabase Auth | — | N/A |
| `/auth/callback` | supabase client directly | Supabase Auth | — | N/A |

**Key finding: `'demo-user'` hardcoded in 8/13 pages.** Auth integration incomplete — no page reads real `userId` from session.

---

## 3. Event Flow Completeness

### Emitted events with NO subscribers (dead emissions)
- `MISSION_CREATED` — fired into void
- `MISSION_UPDATED` — fired into void
- `MISSION_DELETED` — fired into void
- `CAMPAIGN_CREATED` — fired into void
- `CAMPAIGN_UPDATED` — fired into void

### Events with audio-only subscribers (no business logic)
- `CAMPAIGN_COMPLETED` → plays sound, nothing else
- `XP_GAINED` → plays sound, nothing else
- `STREAK_UPDATED` → plays sound, nothing else
- `FOCUS_STARTED` → plays sound, nothing else
- `FOCUS_ENDED` → plays sound, nothing else
- `REWARD_CAPSULE_OPENED` → plays sound, nothing else

### 🐛 Redundant double-processing in `MISSION_COMPLETED` subscriber
File: `src/core/events/subscribers.ts:13-19`
- `rewardService.processMissionCompletion()` already calls `updateStreak()` + `checkAndUnlock()`
- Then subscriber calls them *again* on lines 17-18
- Streaks & achievements process twice per mission completion

### 🗑️ Dead type file
`src/core/types/events.ts` (32 lines, never imported anywhere). Contains `ACHIEVEMENT_PROGRESS`, `DAILY_BRIEFING_OPENED`, `WORKSPACE_UPGRADED`, `NOTIFICATION_SENT` — defined but never emitted or listened to.

---

## 4. Store-to-Service Wiring

| Store | Connected To | Loaded By Page(s) | Missing Store |
|---|---|---|---|
| `app-store` | analyticsService ✅ | Dashboard, Workspace, Header, CommandPalette, SessionInitializer | — |
| `mission-store` | missionService ✅ | Dashboard, Missions, GoalBreakdown | — |
| `campaign-store` | campaignService ✅ | Campaigns | — |
| `focus-store` | focusService ✅ | Focus | — |
| `achievement-store` | achievementService ✅ | Dashboard, Achievements | — |
| `xp-store` | ❌ **No service** — only uses `calculateLevel` utility | Dashboard | **Missing:** xpStore never calls xpService to load data |
| `ai-store` | aiService ✅ | Dashboard, GoalBreakdown, AICoach, DailyBriefing, WeeklyPlanner | — |
| `audio-store` | audioEngine ✅ | Focus, Settings, AICoach | — |

### Models with no store, accessed directly via service+useState
- Analytics page → `analyticsService` (direct)
- Memory Lane page → `memoryLaneService` (direct)

### Existing services with NO store at all
- notification-service (handled loosely through app-store)
- streak-service (no UI reads streaks directly)
- reward-service (no UI needed)
- workspace-service (no store — page uses app-store for stats only)

---

## 5. API Routes

**Only 1 exists:** `GET /api/auth/callback` — Supabase OAuth PKCE handler. Never called by frontend; triggered externally by Supabase.

**Missing API routes:** Zero CRUD endpoints exist. All data flows client-side: store → service → Prisma. This is an architectural issue — Prisma calls from client components will fail in production (services run on server but are imported by client components via tree-shaken zustand stores).

---

## 6. Unused Database Tables

| Model | Created | Read | Updated | Status |
|---|---|---|---|---|
| `User` | ❌ | ❌ | ❌ | **UNUSED** — Supabase auth.users used instead |
| `Profile` | ❌ | ❌ | ❌ | **UNUSED** — registration doesn't create profile records |
| `Subtask` | ❌ | ❌ | ❌ | **UNUSED** — defined in schema, mission has relation, zero queries |
| `AudioPreference` | ❌ | ❌ | ❌ | **UNUSED** — schema matches audio-store state but never persisted |
| `Campaign` | ✅ | ✅ | ✅ | Used |
| `Mission` | ✅ | ✅ | ✅ | Used |
| `MissionHistory` | ✅ | ❌ | ❌ | Only written, never read |
| `XPTransaction` | ✅ | ✅ | ❌ | Used |
| `UserProgress` | ✅ | ✅ | ✅ | Used |
| `Achievement` | ✅ | ✅ | ❌ | Used |
| `UserAchievement` | ✅ | ✅ | ✅ | Used |
| `Streak` | ✅ | ✅ | ✅ | Used |
| `FocusSession` | ✅ | ✅ | ✅ | Used |
| `FocusStatistic` | ✅ | ✅ | ✅ | Used |
| `Notification` | ✅ | ✅ | ✅ | Used |
| `WorkspaceProgression` | ✅ | ✅ | ✅ | Used |
| `MemoryLane` | ✅ | ✅ | ❌ | Used |
| `AnalyticsEvent` | ❌ | ❌ | ❌ | Only `trackEvent()` exists but never called by any page |
| `AIGeneration` | ✅ | ✅ | ❌ | Used by ai-engine and ai-service |

---

## 7. Bugs Found

### Critical
1. **xp-service.ts:92 — `LEVEL_UP` deadlocked**: `previousProgress` is queried after the upsert that updates it, so `previousLevel === levelInfo.level` always, and `LEVEL_UP` never fires.
2. **subscribers.ts:13-19 — Double processing**: `MISSION_COMPLETED` handler calls `updateStreak()` and `checkAndUnlock()` redundantly (already done inside `processMissionCompletion`).
3. **Architecture**: All stores import services that use Prisma directly. These services run on the server, but are imported into client components. In Next.js SSR this works through tree-shaking, but pure client navigation may not re-fetch — data may be stale. No API routes or server actions exist for CRUD.

---

## 8. Action Items

### Critical
- [ ] Fix `xp-service.ts` `LEVEL_UP` bug (move `findUnique` before upsert)
- [ ] Fix `subscribers.ts` double-processing (remove lines 17-18)
- [ ] Replace `'demo-user'` with real `userId` from session-initializer

### High
- [ ] Wire `xp-store` to `xpService` (currently has no data source)
- [ ] Add API routes for CRUD operations (missions, campaigns, focus, etc.) or use Next.js 16 server actions
- [ ] Connect `AudioPreference` persistence to database

### Medium
- [ ] Create stores for analytics, memory-lane (inconsistent patterns)
- [ ] Add subscribers for 5 orphaned events (MISSION_CREATED, MISSION_UPDATED, MISSION_DELETED, CAMPAIGN_CREATED, CAMPAIGN_UPDATED)
- [ ] Add business logic subscribers for 6 audio-only events
- [ ] Delete `src/core/types/events.ts` (dead file) or reconcile with real types
- [ ] Wire Profile creation on user registration

### Low
- [ ] Prune unused tables from schema (Subtask, AudioPreference if no plans to use)
- [ ] Build notification-store for notification badge (currently ad-hoc in app-store)
- [ ] Wire `trackEvent()` to actually be called from meaningful places
