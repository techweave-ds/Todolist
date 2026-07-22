# Pages — Complete Reference

## 1. Landing Page (`/`)

**File**: `src/app/page.tsx` (64 lines) — Server component  
**Layout**: Full-page scrolling with 8 sections  
**Auth**: Public

### Layout
```
┌─────────────────────────────────────────────┐
│ Header: Logo | Sign In | Get Started | Tour │
├─────────────────────────────────────────────┤
│             Particle Background              │
│           Hero Section (animated)            │
├─────────────────────────────────────────────┤
│            Features Bento Grid               │
├─────────────────────────────────────────────┤
│              Sci-Fi Showcase                 │
├─────────────────────────────────────────────┤
│                 Manifesto                    │
├─────────────────────────────────────────────┤
│                Testimonials                  │
├─────────────────────────────────────────────┤
│               FAQ Accordion                  │
├─────────────────────────────────────────────┤
│              Final CTA Button                │
├─────────────────────────────────────────────┤
│                 Footer                       │
└─────────────────────────────────────────────┘
```

### Components Used
- `ParticleBackground` — animated 3D particle field
- `CustomCursor` — custom cursor follower
- `HeroSection` — headline + subtitle + CTA buttons
- `FeaturesBento` — grid of feature cards (missions, focus, AI, analytics, workspace, campaigns, memory lane, achievements, audio)
- `SciFiShowcase` — product screenshots with sci-fi overlay
- `Manifesto` — product philosophy statement
- `FAQSection` — expandable question/answer items
- `Testimonials` — user quote cards
- `FinalCTA` — "Start Your Mission" button

---

## 2. Login Page (`/login`)

**File**: `src/app/(auth)/login/page.tsx` (174 lines) — Client component  
**Layout**: Centered card  
**Auth**: Public (redirects to /dashboard if already authenticated)

### Layout
```
┌─────────────────────────┐
│   Mission Control OS     │
│   Logo + Title           │
│                          │
│   ┌─────────────────┐   │
│   │ Email Input      │   │
│   │ Password Input   │   │
│   │ [Sign In]        │   │
│   └─────────────────┘   │
│                          │
│   ─── or continue with ───
│   [Google] [GitHub]      │
│                          │
│   [Send Magic Link]      │
│                          │
│   No account? Register   │
│   [Try Demo Mode]        │
└─────────────────────────┘
```

### Data Flow
1. User enters email + password → `loginWithEmail(formData)` server action
2. Server checks Prisma User table by email
3. Sets `local_user_id` cookie (30 day expiry)
4. `SessionInitializer` detects cookie → sets userId in app-store
5. Proxy redirects to /dashboard

### Auth Options
- **Email/Password**: Local auth via Prisma (no real password — email-only)
- **Google OAuth**: Supabase redirect
- **GitHub OAuth**: Supabase redirect
- **Magic Link**: Supabase email magic link
- **Demo Mode**: `startDemo()` server action → seeds data → sets demo cookie

---

## 3. Register Page (`/register`)

**File**: `src/app/(auth)/register/page.tsx` (100 lines) — Client component  
**Layout**: Centered card  
**Auth**: Public

### Layout
```
┌─────────────────────────┐
│   Create Your Account    │
│                          │
│   Display Name Input     │
│   Email Input            │
│                          │
│   [Create Account]       │
│                          │
│   Already have one? Log in
│   [Try Demo Mode]        │
└─────────────────────────┘
```

### Data Flow
1. User submits → `registerUser(formData)` server action
2. Creates User + Profile + UserProgress + AudioPreference in DB
3. Sets `local_user_id` and `local_user_email` cookies
4. Redirects to /dashboard

---

## 4. Demo Page (`/demo`)

**File**: `src/app/(auth)/demo/page.tsx` (139 lines) — Client component  
**Layout**: Full-page step-by-step tour  
**Auth**: Public

### Steps (10 total)
1. Welcome — "Welcome to Mission Control"
2. Dashboard — "Your command center"
3. Missions — "Deploy your first mission"
4. Campaigns — "Group missions into campaigns"
5. Focus — "Deep work sessions"
6. Achievements — "Earn badges"
7. Analytics — "Track your productivity"
8. Memory Lane — "Your journey"
9. Audio — "Immersive soundscapes"
10. Ready — "Start with demo data"

### Data Flow
On step 10 "Ready": calls `startDemo()` → creates demo user with 5 missions, 1 campaign, 1 focus session, achievements → sets demo cookie → redirects to /dashboard

---

## 5. Dashboard (`/dashboard`)

**File**: `src/app/(app)/dashboard/page.tsx` (256 lines) — Client component  
**Layout**: Single column with sections  
**Auth**: Authenticated

### Layout
```
┌─────────────────────────────────────────────┐
│  MissionHero — Greeting + XP display        │
│  "Good morning, Commander"                   │
├─────────────────────────────────────────────┤
│  Quick Actions:                              │
│  [New Mission] [Start Focus] [New Campaign]  │
│  [AI Coach] [Briefing]                       │
├─────────────────────────────────────────────┤
│  Stats Cards (4):                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │Today │ │Streak│ │Focus │ │Achvm │      │
│  │M:ssns│ │ Days │ │Score │ │ Count│      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
├─────────────────────────────────────────────┤
│  AI Motivation Quote                         │
├─────────────────────────────────────────────┤
│  Active Missions (collapsible list)          │
│  ┌─────────────────────────────────────┐    │
│  │ Mission 1  ● High   +50 XP  [☐]    │    │
│  │ Mission 2  ● Med    +25 XP  [☐]    │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  Campaign Progress (bars)                    │
│  Campaign A ████████░░ 80%                   │
│  Campaign B ████░░░░░░ 40%                   │
├─────────────────────────────────────────────┤
│  CommanderProfile — level, XP, streak        │
├─────────────────────────────────────────────┤
│  DailyBriefing (popup)                       │
│  WeeklyPlanner (section)                     │
│  AICoach (modal trigger)                     │
│  GoalBreakdown (modal trigger)               │
└─────────────────────────────────────────────┘
```

### Stores Used
- `useAppStore` — userId, dashboardStats
- `useMissionStore` — missions, fetchMissions
- `useXPStore` — level, currentXP, xpToNextLevel, progress, totalXP
- `useAIStore` — motivation

### Data Flow
1. On mount: `fetchDashboardStats(userId)` → analyticsService.getDashboardStats
2. On mount: `fetchMissions(userId)` → fetches all missions
3. On mount: `fetchLevelInfo(userId)` → xpService.getLevelInfo
4. On mount: `getMotivation(userId)` → AI generates motivational quote
5. Daily Briefing pops up on first visit each day (or on button click)
6. Quick actions open modals: GoalBreakdown, AICoach, New Mission form

---

## 6. Missions Page (`/missions`)

**File**: `src/app/(app)/missions/page.tsx` (536 lines) — Client component  
**Layout**: Single column with filter bar + mission list  
**Auth**: Authenticated

### Layout
```
┌─────────────────────────────────────────────┐
│  Title: "Missions"  Subtitle: "Manage tasks" │
│  [Filter: All|Pending|Active|Completed]      │
│  [Sort: Deadline|Priority|Newest]            │
│  [Generate with AI]  [New Mission]           │
├─────────────────────────────────────────────┤
│  Create Mission Form (collapsible):          │
│  Title | Description                         │
│  Due Date | Time | Remind | Est. Time        │
│  Priority | Difficulty | Campaign | Category │
│  Tags (comma-separated)                      │
│  [Deploy Mission] [Cancel]                   │
├─────────────────────────────────────────────┤
│  Mission Card (repeated):                    │
│  ┌──────────────────────────────────────┐   │
│  │ [☐] Title ● Priority │ Difficulty   │   │
│  │      Description (truncated)         │   │
│  │      📅 2 days ago ⏱ 30m 🏷️ tags    │   │
│  │      Campaign: name  +50 XP          │   │
│  │      SubtaskList (per mission)       │   │
│  │      [...] context menu              │   │
│  │        └ Complete / Reopen / Edit    │   │
│  │          / Delete                    │   │
│  └──────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Empty State (when no missions):             │
│  "No missions deployed" + [Deploy Mission]   │
└─────────────────────────────────────────────┘
```

### Components Used
- `GoalBreakdown` — AI goal breakdown modal
- `EmptyState` — icon + title + description + action button
- `XpDisplay` — floating XP animation on complete
- `SubtaskList` — per-mission subtask CRUD (add, toggle, delete)

### Filters & Sorting
- **Status filter**: all, pending, active, completed
- **Sort by**: deadline (ascending), priority (critical→low), newest (createdAt desc)
- **Priority colors**: critical=red, high=orange, medium=yellow, low=green

### Key Interactions
- Click checkbox → complete mission → XP float animation → sound plays
- Click completed checkbox → reopen mission
- Three-dot menu → complete/reopen, edit, delete
- "Generate with AI" → opens GoalBreakdown modal
- Subtask list → add subtask via input, toggle with checkbox, delete

---

## 7. Campaigns Page (`/campaigns`)

**File**: `src/app/(app)/campaigns/page.tsx` (171 lines) — Client component  
**Layout**: 2-column grid of campaign cards  
**Auth**: Authenticated

### Layout
```
┌─────────────────────────────────────────────┐
│  Title: "Campaigns"  [New Campaign]          │
├─────────────────────────────────────────────┤
│  Create Form (collapsible):                  │
│  Name | Description | Emoji Picker (10)     │
│  [Create] [Cancel]                           │
├─────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐             │
│  │ 🚀 Title   │  │ 🎯 Title   │             │
│  │ Description│  │ Description│             │
│  │ 3/5 m:ssns │  │ 1/2 m:ssns │             │
│  │ +250 XP    │  │ +50 XP     │             │
│  │ ██████░░░ │  │ ████░░░░░ │             │
│  │ [...]      │  │ [...]      │             │
│  └────────────┘  └────────────┘             │
│  ┌────────────┐  ┌────────────┐             │
│  │ 🌟 Title   │  │ (empty)    │             │
│  │ 0/8 m:ssns │  │            │             │
│  │ +0 XP      │  │            │             │
│  │ ░░░░░░░░░ │  │            │             │
│  └────────────┘  └────────────┘             │
├─────────────────────────────────────────────┤
│  Empty State: "No campaigns deployed"        │
└─────────────────────────────────────────────┘
```

### Data Flow
- `fetchCampaigns(userId)` → `fetchCampaignsAction` → `campaignService.getByUser` → computes progress, totalMissions, completedMissions, totalXP from associated missions
- Campaign progress = `(completedMissions / totalMissions) × 100`
- Campaign totalXP = sum of xpReward from completed missions

---

## 8. Focus Page (`/focus`)

**File**: `src/app/(app)/focus/page.tsx` (267 lines) — Client component  
**Layout**: Centered timer card + statistics  
**Auth**: Authenticated

### Layout
```
┌─────────────────────────────────────────────┐
│  Title: "Focus"  Subtitle: "Deep work"       │
├─────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐   │
│  │  [Focus] [Short] [Long] [Custom]     │   │
│  │  Mode selector                       │   │
│  │                                      │   │
│  │  Ambient selector                    │   │
│  │  [🧘 Deep Focus] [🌧️ Rain] ...       │   │
│  │                                      │   │
│  │  Custom: [30] min (only in custom)   │   │
│  │                                      │   │
│  │     25:00                            │   │
│  │     Focus Time                       │   │
│  │                                      │   │
│  │     [► Start]                        │   │
│  │     (or when active)                 │   │
│  │     [⏸ Pause] [■ End]               │   │
│  │     Distractions: 0 [+1]             │   │
│  └──────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Stats (3 cards):                           │
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │Sessions│ │Minutes │ │Avg Scr │          │
│  │   12   │ │  320   │ │   85   │          │
│  └────────┘ └────────┘ └────────┘          │
├─────────────────────────────────────────────┤
│  Weekly Bar Chart:                           │
│  ██ ████ █ ██████ ███ ████████              │
│  Mon Tue Wed Thu Fri Sat Sun                │
└─────────────────────────────────────────────┘
```

### Timer Behavior
- **Pomodoro**: 25 min focus, 5 min short break, 15 min long break
- **Custom**: 1-180 minutes
- Deep focus mode auto-starts ambient (`focus_deep`)
- Pause/resume with state toggle
- End early with manual stop (logs partial session)
- Distraction counter increments on click
- Auto-end when timer reaches 0 — calls `endSession`
- Uses functional state update for timer (no stale closure drift)

### Data Flow
1. Mount: `fetchStats(userId)` + `fetchWeeklyData(userId)`
2. Start: `startSession(input, userId)` → server creates session → emits FOCUS_STARTED
3. End: `endSession(id, userId, duration, completed, distractions)` → server updates session + stats → awards XP (completed + ≥5 min) → creates notification + memory lane entry → emits FOCUS_ENDED

---

## 9. Achievements Page (`/achievements`)

**File**: `src/app/(app)/achievements/page.tsx` (88 lines) — Client component  
**Layout**: Grid of achievement cards  
**Auth**: Authenticated

### Layout
```
┌─────────────────────────────────────────────┐
│  Title: "Achievements"                      │
├─────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │ 🏆     │ │ ⚡     │ │ 🔥     │          │
│  │ First  │ │ Streak │ │ Streak │          │
│  │ Mission│ │ 7 Days │ │ 30 Days│          │
│  │ Common │ │ Common │ │ Rare   │          │
│  │ ✅     │ │ ██░░  │ │ ░░░░  │          │
│  │ 25 XP  │ │ 50/50 │ │ 0/30  │          │
│  └────────┘ └────────┘ └────────┘          │
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │ 10     │ │ 50     │ │ 100    │          │
│  │Missions│ │Missions│ │Missions│          │
│  │ Common │ │ Rare   │ │ Epic   │          │
│  │ 2/10   │ │ 0/50   │ │ 0/100  │          │
│  └────────┘ └────────┘ └────────┘          │
│  (and 5 more: campaign_finisher,            │
│   focus_master, focus_100, level_5/10/25)   │
└─────────────────────────────────────────────┘
```

### Rarity Colors
- common: text-gray-400
- rare: text-blue-400
- epic: text-purple-400
- legendary: text-yellow-400 (animated glow)

### Unlocked State
Shows ✅ badge + unlocked date + "Unlocked!" label

---

## 10. Analytics Page (`/analytics`)

**File**: `src/app/(app)/analytics/page.tsx` (123 lines) — Client component  
**Layout**: Stats + charts  
**Auth**: Authenticated

### Layout
```
┌─────────────────────────────────────────────┐
│  Title: "Analytics"                         │
├─────────────────────────────────────────────┤
│  Stat Cards (4):                            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ │
│  │Compltn │ │Focus   │ │Current │ │Longst│ │
│  │ Rate   │ │ Time   │ │ Level  │ │Streak│ │
│  │  75%   │ │ 320m   │ │   5    │ │  12  │ │
│  └────────┘ └────────┘ └────────┘ └──────┘ │
├─────────────────────────────────────────────┤
│  Category Distribution (bars):              │
│  Work     ████████████ 12 (8 completed)     │
│  Personal ██████░░░░░░  6 (4 completed)     │
│  Health   ██░░░░░░░░░░  2 (1 completed)     │
├─────────────────────────────────────────────┤
│  Recent Focus Sessions:                     │
│  Mon 25m Pomodoro  ✅ Score 90              │
│  Tue 15m Custom    ❌ Score 60              │
│  Wed 25m Pomodoro  ✅ Score 85              │
├─────────────────────────────────────────────┤
│  Quick Stats: Level 5, Total XP 1250,       │
│  42 Missions Done, 320 Focus Minutes,       │
│  12 Day Streak, 6 Achievements              │
└─────────────────────────────────────────────┘
```

### Stores Used
- `useAnalyticsStore` — stats, completionRate, focusData, categoryData
- Fetches all 4 data sources in parallel on mount

---

## 11. Memory Lane Page (`/memory-lane`)

**File**: `src/app/(app)/memory-lane/page.tsx` (108 lines) — Client component  
**Layout**: Timeline + grid  
**Auth**: Authenticated

### Layout
```
┌─────────────────────────────────────────────┐
│  Title: "Memory Lane"                       │
├─────────────────────────────────────────────┤
│  Timeline (grouped by date):                │
│  ─── July 15, 2026 ───                      │
│  🏆 Achievement: Level 5 Reached!           │
│  🎯 Major Win: Focus Session 25 min         │
│  ─── July 14, 2026 ───                      │
│  🎉 Milestone: First Campaign Complete      │
│  🔥 Streak Record: 7 Day Streak             │
│  ─── July 10, 2026 ───                      │
│  🏆 Achievement: First Mission             │
│                                            │
│  All Memories (grid view):                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 🏆      │ │ 🎯      │ │ 🎉      │   │
│  │ Level 5 │ │ Focus   │ │ Campaign│   │
│  │ Title   │ │ Session │ │ Complete│   │
│  │ Jul 15  │ │ Jul 15  │ │ Jul 14  │   │
│  └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────┘
```

### Memory Types + Icons
- achievement → 🏆 Trophy
- milestone → 🎉 Sparkles
- campaign_complete → 🚀 Rocket
- streak_record → 🔥 Flame
- major_win → 🎯 Target

---

## 12. Settings Page (`/settings`)

**File**: `src/app/(app)/settings/page.tsx` (321 lines) — Client component  
**Layout**: Tab-based settings panels  
**Auth**: Authenticated

### Layout
```
┌─────────────────────────────────────────────┐
│  Title: "Settings"                          │
│  Tab Bar: [Audio] [Appearance] [Notifs] [Privacy]
├─────────────────────────────────────────────┤
│  TAB: Audio                                 │
│  ┌──────────────────────────────────────┐   │
│  │ Sound: [Toggle]                      │   │
│  │ Master Volume  ████████░░ 80%        │   │
│  │ Music          ██████░░░░ 70%        │   │
│  │ SFX            ████████░░ 80%        │   │
│  │ Ambient        █████░░░░░ 50%        │   │
│  │ Voice/AI       ████████░░ 80%        │   │
│  │ UI Sounds      ██████░░░░ 60%        │   │
│  └──────────────────────────────────────┘   │
│  Sound Profile: [Default][Subtle][Intense][Premium]
│  Ambients: [🧘][🌱][🌧️][🌲][🌊][☕][🫧][🎧]
│  Sound Preview: [Mission Complete] [Level Up] ...
│  Premium Upsell (if not unlocked)            │
├─────────────────────────────────────────────┤
│  TAB: Appearance                             │
│  6 Theme previews (gradient swatches)        │
├─────────────────────────────────────────────┤
│  TAB: Notifications                          │
│  5 Toggle switches (mission reminders,       │
│  achievement alerts, streaks, briefing, focus)│
├─────────────────────────────────────────────┤
│  TAB: Privacy & Data                         │
│  3 Toggle switches (analytics, AI, export)   │
└─────────────────────────────────────────────┘
```

### Data Flow
- Mount: `loadPreferences(userId)` → GET /api/audio-prefs → sets volumes from DB
- Volume change: `setBusVolume` → audioEngine + state update → `savePreferences(userId)` debounced via useEffect
- Profile/ambient change: updates audio-engine → saves to DB

---

## 13. Workspace Page (`/workspace`)

**File**: `src/app/(app)/workspace/page.tsx` (143 lines) — Client component  
**Layout**: Full-screen 3D canvas with overlay controls  
**Auth**: Authenticated

### Layout
```
┌─────────────────────────────────────────────┐
│  3D Scene (Three.js Canvas):                │
│  ┌──────────────────────────────────────┐   │
│  │                                      │   │
│  │    Desk, Laptop, Chair, Walls,       │   │
│  │    Lighting, Plants, Monitors,       │   │
│  │    Bookshelf, Artwork, Clock,        │   │
│  │    Standing Desk, Awards, etc.       │   │
│  │    (26 unlockable objects)           │   │
│  │                                      │   │
│  │  ┌────── HUD Overlay ──────┐        │   │
│  │  │ Stage: 3/5  Objects: 12 │        │   │
│  │  │ Ambient: [☀️] [🌙] [🌧️]  │        │   │
│  │  │ [⟳ Auto-rotate]         │        │   │
│  │  │ [⊜ Reduce Motion]       │        │   │
│  │  └────────────────────────┘        │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  UnlockNotification (popup when new object   │
│  is unlocked)                                │
└─────────────────────────────────────────────┘
```

### Workspace Stages
| Stage | Level Required | Objects Available | New Items |
|-------|---------------|-------------------|-----------|
| 1 | 1 | 6 | desk, laptop, chair, floor, walls, basic-lighting |
| 2 | 5 | 4 | desk-plant, desk-lamp, dual-monitors, mechanical-keyboard |
| 3 | 10 | 5 | bookshelf, large-monitor, artwork, soft-lighting, clock |
| 4 | 15 | 5 | standing-desk, premium-chair, ambient-lighting, awards-shelf, mission-display |
| 5 | 25 | 6 | executive-desk, panoramic-window, digital-wall, premium-furniture, achievement-shelf, command-center |

### Ambient Modes
Morning, Afternoon, Evening, Night, Rain, Forest, Space

---

## 14. Not Found Page (`/_not-found`)

**File**: `src/app/not-found.tsx` (11 lines) — Server component  
**Layout**: Minimal with "Return home" link  
**Auth**: Public

```
┌────────────────────────────────┐
│    404 - Page Not Found        │
│    [Return home]               │
└────────────────────────────────┘
```

---

## API Routes

### `GET /api/health`
Returns `{ status: "ok", uptime: <seconds>, timestamp: <ISO>, database: "connected" }` or 503 if DB fails.

### `GET /api/audio-prefs`
Returns user's `AudioPreference` record. Requires auth (cookie-based).

### `POST /api/audio-prefs`
Body: `{ masterVolume, musicVolume, sfxVolume, ambientVolume, voiceVolume, uiVolume, activeProfile, premiumPacks }`  
Upserts `AudioPreference` for authenticated user.

### `GET /api/auth/callback`
Supabase OAuth PKCE exchange — exchanges code param for session, redirects to `/dashboard`.
