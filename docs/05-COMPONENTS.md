# Components — Complete Reference

## 1. Component Directory Structure

```
src/components/
├── analytics.tsx                            # Analytics tracking (page views)
├── auth/
│   └── session-initializer.tsx              # Auth session initialization
├── landing/                                 # Landing page sections (8 files)
│   ├── particle-background.tsx              # Animated particle field
│   ├── cursor.tsx                           # Custom cursor follower
│   ├── hero.tsx                             # Hero with headline + CTA
│   ├── features-bento.tsx                   # Feature grid
│   ├── sci-fi-showcase.tsx                  # Product showcase
│   ├── manifesto.tsx                        # Philosophy statement
│   ├── testimonials.tsx                     # User testimonials
│   ├── faq.tsx                              # FAQ accordion
│   └── final-cta.tsx                        # Final CTA section
├── layout/                                  # App shell components
│   ├── header.tsx                           # Top bar (logo, search, notifications, profile)
│   ├── sidebar.tsx                          # Navigation sidebar (7 items)
│   └── command-palette.tsx                  # Cmd+K command palette
├── ui/                                      # Primitive UI components
│   ├── button.tsx                           # Styled button
│   ├── card.tsx                             # Glass card
│   ├── dialog.tsx                           # Modal dialog
│   ├── input.tsx                            # Input field
│   ├── select.tsx                           # Dropdown select
│   ├── badge.tsx                            # Badge/tag
│   ├── progress.tsx                         # Progress bar
│   ├── empty-state.tsx                      # Empty state placeholder
│   └── glow-background.tsx                  # Animated glow background
├── glass/                                   # Glassmorphism components
│   ├── glass-card.tsx                       # Glass card wrapper
│   ├── xp-display.tsx                       # Floating XP animation
│   └── level-progress.tsx                   # Level progress bar
├── ai/                                      # AI feature components
│   ├── ai-coach.tsx                         # AI coach chat modal
│   ├── goal-breakdown.tsx                   # Goal breakdown modal
│   ├── daily-briefing.tsx                   # Daily briefing display
│   └── weekly-planner.tsx                   # Weekly plan display
├── dashboard/                               # Dashboard components
│   ├── mission-hero.tsx                     # Top hero banner
│   └── commander-profile.tsx                # User profile card
├── missions/
│   └── subtask-list.tsx                     # Subtask CRUD per mission
├── workspace/                               # 3D workspace components
│   ├── workspace-scene.tsx                  # Three.js Scene setup
│   ├── workspace-canvas.tsx                 # Canvas with controls
│   ├── environment.tsx                      # Lighting/sky/environment
│   ├── desk.tsx                             # Desk mesh
│   ├── chair.tsx                            # Chair mesh
│   ├── electronics.tsx                      # Electronics objects
│   ├── decorations.tsx                      # Decorative objects
│   └── unlock-animation.tsx                 # Unlock notification animation
└── notifications/
    ├── notification-bell.tsx                # Bell icon with dropdown
    └── notification-provider.tsx            # Polling wrapper
```

---

## 2. Component Details

### 2.1 Layout Components

#### Sidebar (`src/components/layout/sidebar.tsx`)
**Role**: Persistent left navigation  
**Content**: 7 navigation items from NAV_ITEMS constant
```
Icon  Dashboard
Icon  Missions
Icon  Campaigns
Icon  Focus
Icon  Achievements
Icon  Analytics
Icon  Memory Lane
```
**Behavior**: Highlighted item matches current route. Collapses on small screens.

#### Header (`src/components/layout/header.tsx`)
**Role**: Top bar across all authenticated pages  
**Content**: Logo/title (left), search trigger (middle), NotificationBell + CommandPalette trigger + User info (right)

#### Command Palette (`src/components/layout/command-palette.tsx`)
**Role**: Cmd+K global command palette  
**Trigger**: Cmd+K keyboard shortcut or header button  
**Content**: Search input, actions list (navigate to pages, create mission, start focus, toggle theme)

---

### 2.2 Auth Components

#### SessionInitializer (`src/components/auth/session-initializer.tsx`)
**Role**: Runs once on app mount to establish authentication  
**Data Flow**:
1. Checks cookies for demo mode → userId
2. Checks cookies for local user → userId
3. Falls back to Supabase session
4. Calls `ensureUserProfile(userId)` to create Profile + UserProgress + AudioPreference if first visit
5. Sets `userId` in app-store

---

### 2.3 AI Components

#### AICoach (`src/components/ai/ai-coach.tsx`)
**Role**: Conversational AI coach  
**UI**: Modal with chat history + input field + send button  
**Data Flow**: Messages append to `coachMessages` array in ai-store. Each send calls `getCoaching(userId, question?)` or `askCoach(question)` → AIEngine.getProductivityCoaching → returns advice. Messages rendered in speech bubbles.

#### GoalBreakdown (`src/components/ai/goal-breakdown.tsx`)
**Role**: Break down a high-level goal into sub-missions  
**UI**: Modal with text input → "Generate" button → loading spinner → list of generated missions → "Create All" button  
**Data Flow**: `aiStore.breakDownGoal(goal, userId)` → AIService → AIEngine → Groq/OpenAI → returns `AiBreakdownResult { title, missions[] }`. Each mission has title, description, difficulty. "Create All" calls `missionStore.createMission()` for each.

#### DailyBriefing (`src/components/ai/daily-briefing.tsx`)
**Role**: Morning briefing with agenda + motivation  
**UI**: Popup/modal with sections: Today's Missions, Stats, AI-generated Motivational Quote  
**Data Flow**: `aiStore.fetchBriefing(userId)` → AIEngine.generateDailyBriefing → returns markdown text with mission summary and encouragement.

#### WeeklyPlanner (`src/components/ai/weekly-planner.tsx`)
**Role**: AI-generated weekly schedule  
**UI**: Card with day-by-day plan + "Generate Weekly Plan" button  
**Data Flow**: `aiStore.fetchWeeklyPlan(userId)` → fetches pending missions → AIEngine.generateWeeklyPlan → returns `AiPlanResult { days[] }` with missions assigned to days.

---

### 2.4 Glassmorphism Components

#### GlassCard (`src/components/glass/glass-card.tsx`)
**Role**: Frosted glass card container  
**CSS**: `backdrop-filter: blur(20px)`, translucent background, subtle border, rounded corners

#### XpDisplay (`src/components/glass/xp-display.tsx`)
**Role**: Animated "+50 XP" float text  
**Trigger**: Appears on mission completion, fades up and out over 2 seconds  
**Props**: `amount`, `show`, `className`

#### LevelProgress (`src/components/glass/level-progress.tsx`)
**Role**: Level indicator with progress bar  
**Content**: Level number, XP progress bar (currentXP / xpToNextLevel), total XP

---

### 2.5 Workspace Components

#### WorkspaceScene (`src/components/workspace/workspace-scene.tsx`)
**Role**: Orchestrates the 3D scene  
**Contains**: `<WorkspaceCanvas>`, `<Environment>`, group meshes (`<Desk>`, `<Chair>`, etc.), lighting, post-processing  
**Behavior**: Checks unlocked objects from workspace-store; only renders unlocked items. Re-renders when unlock status changes.

#### Environment (`src/components/workspace/environment.tsx`)
**Role**: Three.js lighting + sky/environment  
**Props**: `ambientMode` — changes color temperature, sky color, shadow intensity based on mode (morning/afternoon/evening/night/rain/forest/space)

#### UnlockNotification (`src/components/workspace/unlock-animation.tsx`)
**Role**: Celebratory popup when a workspace object unlocks  
**Content**: Object icon + name + stage info + "Dismiss" button  
**Trigger**: Fires when `workspaceStore.lastUnlock` is set

---

### 2.6 Notification Components

#### NotificationBell (`src/components/notifications/notification-bell.tsx`)
**Role**: Bell icon with unread count badge + dropdown list  
**Content**: 
- Bell icon with red badge showing `unreadCount`
- Dropdown: header ("Notifications" + "Mark all read"), scrollable notification list (30 max), each item has icon + title + message + timestamp + "read" state
- **Interactions**: Click notification → mark as read. "X" button → mark as read. "Mark all read" → mark all.

#### NotificationProvider (`src/components/notifications/notification-provider.tsx`)
**Role**: Silent component that triggers `useNotificationPoll()`  
**Polling**: Fetches `getNotifications()` + `getUnreadCount()` every 30 seconds  
**Browser Notifications**: Requests permission, fires native notification for `reminder` type where `remindAt <= now`

---

### 2.7 UI Primitives

| Component | Props | Usage |
|-----------|-------|-------|
| `Button` | `variant`, `size`, `children`, `onClick`, `disabled` | All clickable actions |
| `Card` | `children`, `className` | Information containers |
| `Dialog` | `open`, `onClose`, `title`, `children` | Modal dialogs (AI coach, goal breakdown, etc.) |
| `Input` | `value`, `onChange`, `placeholder`, `type` | Form inputs |
| `Select` | `value`, `onChange`, `options[]` | Dropdown selection |
| `Badge` | `variant`, `children` | Labels, tags, status indicators |
| `Progress` | `value` (0-100) | Progress bars |
| `EmptyState` | `icon`, `title`, `description`, `action?` | Empty data placeholders |
| `GlowBackground` | — | Animated gradient background |

---

## 3. Component Data Flow Patterns

### Pattern A: Page → Store → Server Action → Service → Prisma
Used by: Dashboard, Missions, Campaigns, Focus, Achievements, Analytics, Memory Lane

```
Page component mounts
  → useEffect({ fetchData(userId) })
    → Store.fetchData(userId)
      → Server Action
        → Service.getByUser(userId)
          → prisma.findMany/findUnique
        → Returns data
      → Store.set({ data })
    → Component re-renders
```

### Pattern B: Page → Store → Server Action → Service → Prisma + EventBus
Used by: Mission completion, focus start/end, campaign complete

```
User clicks action
  → Store.doAction(id, userId)
    → Server Action
      → Service.method(id, userId)
        → prisma.update/create
        → Other service method (reward chain)
        → eventBus.emit(event)  // server-side
      → Returns result
    → Store.setState({ ... })  // optimistic update
    → eventBus.emit(event)     // client-side → audio
  → Component shows animation/sound
```

### Pattern C: Page → Audio Store → Audio Engine
Used by: Settings, Focus page ambient selector

```
User adjusts volume/ambient/effect
  → AudioStore.setBusVolume/setActiveProfile/playEffect
    → audioEngine.setBusVolume/playEffect (Web Audio API)
    → Store.setState({ volumes/activeProfile })
  → Component re-renders with new state
```

### Pattern D: AI Interactions
Used by: AI Coach, Goal Breakdown, Weekly Planner, Daily Briefing

```
User provides input
  → AIStore.action(input, userId)
    → Server Action
      → AIService.method(userId, input)
        → AIEngine.method(userId, input)
          → Try providers in order (Groq → OpenAI → Anthropic → Gemini)
          → prisma.aIGeneration.create({ type, prompt, response, model })
        → Returns parsed JSON response
      → Store.setState({ result })
    → Component displays result
```
