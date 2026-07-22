# Stores — Complete Reference

All 11 stores use Zustand (`import { create } from 'zustand'`). Stores are the client-side state layer that bridges UI components to server actions.

---

## 1. App Store (`src/store/app-store.ts`)

**Purpose**: Global app-level state — user identity, dashboard stats, notifications, UI flags.

```typescript
interface AppState {
  // Auth
  userId: string | null
  isDemo: boolean

  // Dashboard
  dashboardStats: DashboardStats | null
  isLoading: boolean
  error: string | null

  // UI
  isCommandPaletteOpen: boolean
  isDailyBriefingOpen: boolean

  // Notifications
  notifications: Notification[]
  unreadCount: number
}
```

**DashboardStats** (returned from `analyticsService.getDashboardStats`):
```
level, totalXP, currentXP, xpToNextLevel, totalMissionsCompleted,
dailyStreak, longestStreak, todayMissions, todayCompleted,
focusMinutes, focusSessions, focusScore,
recentAchievements[] (key, title, emoji, rarity),
activeCampaigns, campaignProgress[] (id, title, emoji, total, completed)
```

**Actions**:
| Action | Server Action Called | Description |
|--------|---------------------|-------------|
| `setUserId(id)` | — | Sets userId, clears demo flag |
| `setDemoMode()` | — | Sets userId to DEMO_USER_ID, isDemo=true |
| `fetchDashboardStats(userId)` | `getDashboardStatsAction` | Loads all dashboard stats |
| `toggleCommandPalette()` | — | Toggles Cmd+K palette |
| `setDailyBriefingOpen(open)` | — | Shows/hides daily briefing |
| `setNotifications(ns)` | — | Replaces notification list |
| `setUnreadCount(count)` | — | Sets unread counter |

**Used by**: Dashboard, Missions, Campaigns, Focus, Workspace, Settings, Header, CommandPalette, SessionInitializer, NotificationBell, NotificationProvider

---

## 2. Mission Store (`src/store/mission-store.ts`)

**Purpose**: Manage mission list + CRUD operations.

```typescript
interface MissionState {
  missions: Mission[]        // Full mission list
  selectedMission: Mission | null
  isLoading: boolean
  error: string | null
}
```

**Mission interface**: `id, userId, campaignId?, title, description?, status, difficulty, priority, deadline?, estimatedTime?, xpReward, progress, tags[], category?, completedAt?, remindAt?, createdAt, updatedAt, campaign? ({ id, title }), subtasks? ({ id, title, completed }[])`

**Actions**:
| Action | Server Action | Events Emitted |
|--------|---------------|----------------|
| `fetchMissions(userId)` | `fetchMissionsAction` | — |
| `createMission(input, userId)` | `createMissionAction` | — (optimistic add to list) |
| `updateMission(id, input, userId)` | `updateMissionAction` | — (map update in list) |
| `completeMission(id, userId)` | `completeMissionAction` | `MISSION_COMPLETED`, `XP_GAINED`, `REWARD_CAPSULE_OPENED`, optionally `LEVEL_UP`, `ACHIEVEMENT_UNLOCKED`, `STREAK_UPDATED` |
| `reopenMission(id, userId)` | `reopenMissionAction` | — |
| `deleteMission(id, userId)` | `deleteMissionAction` | — (filter from list) |
| `setSelectedMission(mission)` | — | — |

**Event emission on complete**: The most complex store action. After server response with `rewardEvents`, emits client-side events in sequence for audio feedback.

**Used by**: Dashboard, Missions page, GoalBreakdown component

---

## 3. Campaign Store (`src/store/campaign-store.ts`)

**Purpose**: Manage campaign list + CRUD.

```typescript
interface CampaignState {
  campaigns: CampaignWithProgress[]
  selectedCampaign: CampaignWithProgress | null
  isLoading: boolean
  error: string | null
}
```

**CampaignWithProgress**: All Campaign fields + `progress` (0-100), `totalMissions`, `completedMissions`, `totalXP` (computed server-side from associated missions).

**Actions**:
| Action | Server Action |
|--------|---------------|
| `fetchCampaigns(userId)` | `fetchCampaignsAction` |
| `createCampaign(input, userId)` | `createCampaignAction` (adds progress defaults) |
| `updateCampaign(id, input, userId)` | `updateCampaignAction` |
| `deleteCampaign(id, userId)` | `deleteCampaignAction` (filter from list) |
| `setSelectedCampaign(campaign)` | — |

**Used by**: Dashboard, Campaigns page, Missions page (campaign selector in create form)

---

## 4. XP Store (`src/store/xp-store.ts`)

**Purpose**: Player level and XP display data.

```typescript
interface XPState {
  level: number
  currentXP: number
  xpToNextLevel: number
  progress: number       // 0-100
  totalXP: number
  xpHistory: XpTransaction[]
  isLoading: boolean
  error: string | null
}
```

**XpTransaction**: `{ id, amount, reason, createdAt }`

**Actions**:
| Action | Server Action |
|--------|---------------|
| `fetchLevelInfo(userId)` | `getLevelInfoAction` → `xpService.getLevelInfo` → `calculateLevel(totalXP)` |
| `fetchXPHistory(userId)` | `getXPHistoryAction` → `xpService.getXPHistory` |

**Note**: `fetchLevelInfo` reads `info.level` from the API response (returns `{ level, currentXP, totalXP, xpToNextLevel, progress }`).

**Used by**: Dashboard (level progress display), XP display components

---

## 5. Focus Store (`src/store/focus-store.ts`)

**Purpose**: Focus timer state + session data.

```typescript
interface FocusState {
  currentSession: FocusSession | null
  sessions: FocusSession[]         // History
  statistics: FocusStatistics | null
  weeklyData: FocusWeeklyEntry[]
  isActive: boolean
  timeRemaining: number            // Seconds
  isLoading: boolean
  error: string | null
}
```

**FocusSession**: `{ id, type, duration, actualDuration?, completed, score?, environment?, startedAt, endedAt? }`  
**FocusStatistics**: `{ totalSessions, totalMinutes, averageScore, longestSession, currentStreak, bestStreak, weeklyMinutes }`  
**FocusWeeklyEntry**: `{ date, minutes, sessions }`

**Actions**:
| Action | Server Action | Events |
|--------|---------------|--------|
| `startSession(input, userId)` | `startFocusSessionAction` | `FOCUS_STARTED` |
| `endSession(id, userId, dur, completed, distractions)` | `endFocusSessionAction` | `FOCUS_ENDED` |
| `fetchHistory(userId)` | `getFocusSessionHistoryAction` | — |
| `fetchStats(userId)` | `getFocusStatisticsAction` | — |
| `fetchWeeklyData(userId)` | `getFocusWeeklyDataAction` | — |
| `setTimeRemaining(t)` | — | Direct state update |

**Used by**: Focus page (timer, stats, weekly chart)

---

## 6. Audio Store (`src/store/audio-store.ts`)

**Purpose**: Audio engine bridge + settings state.

```typescript
interface AudioState {
  isEnabled: boolean
  volumes: Record<BusType, number>   // master, music, sfx, ambient, voice, ui
  currentAmbient: AmbientType | null
  activeProfile: string              // "default" | "subtle" | "intense" | "premium"
  premiumUnlocked: boolean
}
```

**Actions**:
| Action | Engine Call | Description |
|--------|-------------|-------------|
| `setEnabled(enabled)` | `audioEngine.setEnabled` | Toggle all sound |
| `setBusVolume(bus, vol)` | `audioEngine.setBusVolume` | Per-bus volume with smooth ramp |
| `setActiveProfile(id)` | — | Updates state only |
| `playEffect(name)` | `audioEngine.playEffect` | Play sound effect once |
| `playAmbient(env)` | `audioEngine.startAmbient` | Start ambient loop |
| `stopAmbient()` | `audioEngine.stopAmbient` | Stop current ambient |
| `speak(text)` | Web Speech API | TTS via speechSynthesis |
| `stopSpeaking()` | `speechSynthesis.cancel` | Stop TTS |
| `loadPreferences(userId)` | GET /api/audio-prefs | Load persisted settings |
| `savePreferences(userId)` | POST /api/audio-prefs | Save current settings |
| `getSoundProfiles()` | — | Returns 4 profile definitions |
| `getAmbientEnvironments()` | — | Returns 8 ambient definitions |

**Sound Profiles**: Default (balanced), Subtle (gentle), Intense (bold), Premium (studio-quality, locked)  
**Ambient Environments**: Deep Focus, Light Focus, Rain, Forest, Ocean (premium), Café (premium), Bubble Pop, Lo-Fi

**Used by**: Settings page (volume sliders, profile selector, ambient selector, sound preview), Focus page (ambient dropdown), AICoach (speak method)

---

## 7. AI Store (`src/store/ai-store.ts`)

**Purpose**: AI feature state — briefing, planning, coaching, motivation.

```typescript
interface AIState {
  briefing: string | null
  briefingLoading: boolean
  weeklyPlan: any
  weeklyPlanLoading: boolean
  breakdown: AiBreakdownResult | null
  goalResult: any
  goalLoading: boolean
  coaching: string | null
  coachMessages: CoachMessage[]
  coachLoading: boolean
  motivation: string | null
  providerHealth: Record<string, boolean> | null
  isLoading: boolean
  error: string | null
}
```

**Actions**:
| Action | Server Action |
|--------|---------------|
| `fetchBriefing(userId)` | `generateDailyBriefingAction` |
| `fetchWeeklyPlan(userId)` | `generateWeeklyPlanAction` |
| `generateWeeklyPlan(userId)` | `generateWeeklyPlanAction` (regenerates) |
| `breakDownGoal(goal, userId)` | `breakDownGoalAction` |
| `getCoaching(userId, question?)` | `getCoachingAction` |
| `askCoach(question)` | `getCoachingAction` (appends to coachMessages) |
| `getMotivation(userId)` | `getMotivationAction` |
| `getProviderHealth(userId?)` | `getProviderHealthAction` |
| `clearCoach()` | — |

**Used by**: Dashboard, AICoach, GoalBreakdown, DailyBriefing, WeeklyPlanner

---

## 8. Analytics Store (`src/store/analytics-store.ts`)

**Purpose**: Analytics dashboard data.

```typescript
interface AnalyticsState {
  stats: Stats | null                    // DashboardStats
  completionRate: CompletionRate | null  // { total, completed, rate }
  focusData: FocusData | null            // { totalMinutes, totalSessions, averagePerSession, dailyData }
  categoryData: CategoryData             // Record<string, { total, completed }>
  isLoading: boolean
  error: string | null
}
```

**Actions**:
| Action | Server Actions Called |
|--------|----------------------|
| `fetchAnalytics(userId)` | `getDashboardStatsAction` + `getMissionCompletionRateAction` + `getFocusTimeAction` + `getCategoryDistributionAction` (parallel) |

**Used by**: Analytics page

---

## 9. Achievement Store (`src/store/achievement-store.ts`)

**Purpose**: Achievement gallery data.

```typescript
interface AchievementState {
  achievements: UserAchievement[]   // All achievements with unlock status
  isLoading: boolean
  error: string | null
}
```

**Actions**:
| Action | Server Action |
|--------|---------------|
| `fetchAchievements(userId)` | `getUserAchievementsAction` → returns all achievements with user progress |

**Used by**: Achievements page, Dashboard (recent achievements)

---

## 10. Memory Lane Store (`src/store/memory-lane-store.ts`)

**Purpose**: Memory lane timeline data.

```typescript
interface MemoryLaneState {
  entries: MemoryLaneEntry[]       // Raw entries
  timeline: TimelineGroup[]        // Grouped by date
  isLoading: boolean
  error: string | null
}
```

**TimelineGroup**: `{ date, items: MemoryLaneEntry[], significance }`

**Actions**:
| Action | Server Actions Called |
|--------|----------------------|
| `fetchMemoryLane(userId)` | `getMemoryLaneEntriesAction` + `getMemoryLaneTimelineAction` (parallel) |

**Used by**: Memory Lane page

---

## 11. Workspace Store (`src/store/workspace-store.ts`)

**Purpose**: 3D workspace state + unlock progression.

```typescript
interface WorkspaceState {
  unlockedObjectIds: string[]
  currentStage: number              // 1-5
  ambientMode: AmbientMode
  autoRotate: boolean
  reduceMotion: boolean
  lastUnlock: UnlockEvent | null   // For popup animation
  dustIntensity: number
}
```

**Default unlocked**: desk, laptop, chair, floor, walls, basic-lighting (stage 1)

**Actions**:
| Action | Description |
|--------|-------------|
| `setUserStats(stats)` | Sets UserStats for unlock checking |
| `checkUnlocks(stats)` | Evaluates 26 WORKSPACE_OBJECTS conditions against stats; unlocks eligible; sets lastUnlock for popup; computes currentStage |
| `setAmbientMode(mode)` | Changes sky/lighting |
| `setAutoRotate(bool)` | Toggles auto-rotation |
| `setReduceMotion(bool)` | Performance mode |
| `dismissUnlock()` | Clears lastUnlock popup |

**Used by**: Workspace page, WorkspaceScene, UnlockNotification
