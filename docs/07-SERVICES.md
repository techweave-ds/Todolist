# Services — Complete Reference

## Architecture

Services are the **business logic layer** — they contain all Prisma operations, event emissions, and cross-service orchestration. Services are instantiated as singletons and called exclusively from **server actions** (never directly from client components or stores).

Each service directory follows this pattern:
```
src/services/<domain>/
├── <domain>-service.ts   # Class + singleton export
├── index.ts              # Re-exports (optional)
└── (types.ts)            # Domain-specific types (optional)
```

---

## 1. Mission Service (`src/services/missions/mission-service.ts`)

**Singleton**: `missionService`  
**Server Action Bridge**: All methods called from `actions.ts` mission actions

### Methods

#### `create(input: MissionCreateInput, userId: string)`
- Creates `Mission` record with calculated xpReward from difficulty
- Creates `MissionHistory` entry (action: 'created')
- If `remindAt` is set, creates a `Notification` reminder
- Emits `MISSION_CREATED` event
- Calls `analyticsService.trackEvent('mission_created')`

#### `update(id: string, input: MissionUpdateInput, userId: string)`
- Updates `Mission` with partial fields (only defined fields)
- If status=`completed`, sets `completedAt` and `progress=100`
- Creates `MissionHistory` entry (action: 'completed' or 'updated')
- Emits `MISSION_COMPLETED` (if completed) or `MISSION_UPDATED`
- Calls `analyticsService.trackEvent('mission_completed' | 'mission_updated')`

#### `delete(id: string, userId: string)`
- Deletes `Mission` record
- Emits `MISSION_DELETED`
- Calls `analyticsService.trackEvent('mission_deleted')`

#### `getById(id: string, userId: string)`
- Returns single mission with subtasks + campaign

#### `getByUser(userId: string, filters?)`
- Returns missions ordered by priority (desc), deadline (asc), createdAt (desc)
- Optional filters: status, campaignId, priority

#### `getTodayMissions(userId: string)`
- Returns pending/active missions due today

#### `getUpcomingMissions(userId: string, days: number = 7)`
- Returns pending/active missions with deadline within N days

---

## 2. Campaign Service (`src/services/campaigns/campaign-service.ts`)

**Singleton**: `campaignService`

### Methods

#### `create(input, userId)`
- Creates `Campaign` with emoji, color, deadline
- Emits `CAMPAIGN_CREATED`
- Calls `analyticsService.trackEvent('campaign_created')`

#### `update(id, input, userId)`
- Updates campaign with partial fields
- If status=`completed`, emits `CAMPAIGN_COMPLETED` + analytics
- Otherwise emits `CAMPAIGN_UPDATED` + analytics

#### `delete(id, userId)`
- Deletes campaign

#### `getById(id, userId)`
- Returns campaign with missions (including subtasks, ordered by priority/deadline)

#### `getByUser(userId)`
- Returns all campaigns with computed progress metrics:
  - `progress` = (completedMissions / totalMissions) × 100
  - `totalMissions` = count of associated missions
  - `completedMissions` = count of completed missions
  - `totalXP` = sum of xpReward from completed missions

#### `completeCampaign(id, userId)`
- Delegates to `update(id, { status: 'completed' }, userId)`

---

## 3. XP Service (`src/services/xp/xp-service.ts`)

**Singleton**: `xpService`

### Exported Functions (pure, no DB)

#### `calculateMissionXP(difficulty: MissionDifficulty): number`
Returns base XP: easy=25, medium=50, hard=100, legendary=250

#### `calculateTotalXP(difficulty, streak, focusBonus, campaignBonus): XPCalculation`
Calculates total XP with all multipliers:
```
totalXP = baseXP × (1 + streak×0.1 + focusBonus×0.2 + campaignBonus×0.15)
```

#### `calculateLevel(totalXP: number): LevelInfo`
Level algorithm:
```
level = 1, accumulated = 0
while totalXP >= accumulated + xpRequired AND level < 100:
  accumulated += xpRequired
  level++
  xpRequired = 100 × 1.5^(level-1)
return { level, currentXP, totalXP, xpToNextLevel, progress }
```

### Methods

#### `awardXP(userId, amount, reason, referenceId?)`
**Prisma $transaction**:
1. Creates `XPTransaction`
2. Aggregates `_sum(amount)` across all user transactions
3. Calculates level from total XP
4. Fetches `previousProgress` **before** upsert (to allow level-up detection)
5. Upserts `UserProgress` with new level, XP values
6. Emits `XP_GAINED`
7. If level increased: emits `LEVEL_UP`

#### `getXPHistory(userId, limit: number = 50)`
Returns recent XP transactions ordered by date desc.

#### `getLevelInfo(userId)`
Returns `calculateLevel(progress.totalXP)` from DB.

---

## 4. Reward Service (`src/services/rewards/reward-service.ts`)

**Singleton**: `rewardService`  
**Role**: Orchestrator for the mission completion reward chain.

### Methods

#### `processMissionCompletion(userId, missionId, difficulty, streakDays?, hasFocusBonus?, hasCampaignBonus?)`
**Called from**: `completeMissionAction` in `actions.ts`

Flow:
1. `calculateTotalXP(difficulty, streakDays, hasFocusBonus, hasCampaignBonus)` → get XP amount
2. `xpService.awardXP(userId, totalXP, 'mission_completed', missionId)` → earn XP (handles level-up internally)
3. `streakService.updateStreak(userId)` → update daily streak
4. `achievementService.checkAndUnlock(userId)` → evaluate all 11 conditions
5. If leveled up: create notification + memory lane entry
6. If achievement unlocked: create notification + memory lane entry
7. Increment `totalMissionsCompleted` on `UserProgress`
8. Emit `REWARD_CAPSULE_OPENED`
9. Return `rewardEvents` summary (leveledUp, streakChanged, achievementUnlocked, etc.)

#### `getRewardSummary(userId)`
Returns progress, streaks, achievements, recent XP for display.

---

## 5. Focus Service (`src/services/focus/focus-service.ts`)

**Singleton**: `focusService`

### Methods

#### `startSession(input: FocusSessionInput, userId)`
- Creates `FocusSession` with type, duration, environment
- Emits `FOCUS_STARTED`
- Calls `analyticsService.trackEvent('focus_started')`

#### `endSession(sessionId, userId, actualDuration, completed, distractions)`
**Prisma $transaction**:
1. Updates `FocusSession` with actualDuration, completed, endedAt, distractions, calculated score
2. Creates or updates `FocusStatistic`:
   - New: sets totalSessions=1, totalMinutes=actualDuration, averageScore=score, etc.
   - Existing: increments totalSessions, totalMinutes, weeklyMinutes, monthlyMinutes
   - Recalculates averageScore from all completed sessions
   - Updates longestSession if current is longer
3. Emits `FOCUS_ENDED`
4. Calls `analyticsService.trackEvent('focus_ended')`

**Score calculation**: `max(0, 100 - distractions × 10)`

#### `getSessionHistory(userId, limit: number = 20)`
Returns recent sessions ordered by startedAt desc.

#### `getStatistics(userId)`
Returns `FocusStatistic` for user.

#### `getWeeklyData(userId)`
Groups sessions into 7-day buckets, returns `[{ date, minutes, sessions }]`.

---

## 6. Streak Service (`src/services/streaks/streak-service.ts`)

**Singleton**: `streakService`

### Methods

#### `updateStreak(userId, type: 'daily' | 'weekly' = 'daily')`
- Upserts Streak record
- Checks lastActivityDate:
  - **New day** (date changed): increment currentStreak, update longestStreak
  - **Same day**: no change (already counted)
  - **Missed day** (gap > 1 day): reset currentStreak to 1
- Emits `STREAK_UPDATED` if streak value changed
- Returns `{ changed, currentStreak, longestStreak }`

#### `getStreak(userId, type)`
Returns single streak record.

#### `getStreaks(userId)`
Returns all streak types for user.

---

## 7. Achievement Service (`src/services/achievements/achievement-service.ts`)

**Singleton**: `achievementService`  
**Role**: Evaluates unlock conditions for all 11 achievements.

### Methods

#### `checkAndUnlock(userId)`
Loads current state (progress, streaks, achievements, focusStats, campaigns), then evaluates each achievement condition:

| Achievement | Condition |
|-------------|-----------|
| `first_mission` | totalMissionsCompleted ≥ 1 |
| `streak_7` | daily streak ≥ 7 |
| `streak_30` | daily streak ≥ 30 |
| `missions_10` | totalMissionsCompleted ≥ 10 |
| `missions_50` | totalMissionsCompleted ≥ 50 |
| `missions_100` | totalMissionsCompleted ≥ 100 |
| `campaign_finisher` | any campaign with status 'completed' |
| `focus_master` | total focus sessions ≥ 10 |
| `focus_100` | total focus sessions ≥ 100 |
| `level_5` | level ≥ 5 |
| `level_10` | level ≥ 10 |
| `level_25` | level ≥ 25 |

For each:
- If condition met and not already unlocked: calls `unlockAchievement(userId, key)`
- If condition partially met: updates progress percentage

Returns the first newly-unlocked achievement (or null).

#### `unlockAchievement(userId, achievementKey)`
- Upserts Achievement definition
- Upserts UserAchievement (unlocked=true, unlockedAt=now)
- Awards XP via `xpService.awardXP`
- Emits `ACHIEVEMENT_UNLOCKED`

#### `getUserAchievements(userId)`
Returns all user achievements with achievement definition data.

---

## 8. Notification Service (`src/services/notifications/notification-service.ts`)

**Singleton**: `notificationService`

### Methods
| Method | Description |
|--------|-------------|
| `create(userId, type, title, message?, data?)` | Creates notification record |
| `getUnread(userId)` | Returns unread notifications |
| `getAll(userId, limit=50)` | Returns all notifications |
| `markAsRead(id, userId)` | Marks single notification as read |
| `markAllAsRead(userId)` | Marks all as read |
| `delete(id, userId)` | Deletes notification |
| `getUnreadCount(userId)` | Returns count of unread |

---

## 9. Auth Service (`src/services/auth/auth-service.ts`)

**Singleton**: `authService`  
**Role**: Supabase auth wrapper (conditionally enabled).

### Methods
| Method | Description |
|--------|-------------|
| `loginWithEmail(email, password)` | Supabase signInWithPassword |
| `loginWithGoogle()` | Supabase OAuth Google |
| `loginWithGithub()` | Supabase OAuth GitHub |
| `sendMagicLink(email)` | Supabase signInWithOtp |
| `register(email, password)` | Supabase signUp |
| `logout()` | Supabase signOut |
| `getSession()` | Supabase getSession |
| `getUser()` | Supabase getUser |

All methods check `isSupabaseConfigured` first — if not, they throw with fallback instructions.

---

## 10. Analytics Service (`src/services/analytics/analytics-service.ts`)

**Singleton**: `analyticsService`

### Methods
| Method | Description |
|--------|-------------|
| `trackEvent(userId, event, properties?)` | Creates AnalyticsEvent record |
| `getMissionCompletionRate(userId, days=30)` | Completed/total ratio |
| `getFocusTime(userId, days=30)` | Session aggregation + daily breakdown |
| `getXPGrowth(userId, days=30)` | Cumulative XP over time |
| `getCategoryDistribution(userId)` | Missions grouped by category |
| `getPeakProductivityHours(userId)` | Hourly completion distribution |
| `getDashboardStats(userId)` | Comprehensive stats (see DashboardStats) |

---

## 11. Memory Lane Service (`src/services/memory-lane/memory-lane-service.ts`)

**Singleton**: `memoryLaneService`

### Methods
| Method | Description |
|--------|-------------|
| `addEntry(userId, type, title, description?, metadata?, significance?)` | Creates memory lane entry |
| `getEntries(userId, limit=50)` | Returns entries ordered by date desc |
| `getEntriesByType(userId, type)` | Filtered by type |
| `getTimeline(userId)` | Entries grouped by date with significance |
| `getAnnualWrapped(userId, year?)` | Year-in-review: total missions, XP, focus minutes, top moments |

---

## 12. Workspace Service (`src/services/workspace/workspace-service.ts`)

**Singleton**: `workspaceService`

### Methods
| Method | Description |
|--------|-------------|
| `create(userId, theme?)` | Creates workspace progression record |
| `getByUserId(userId)` | Returns workspace state |
| `update(userId, data)` | Updates workspace fields |
| `addUpgrade(userId, upgrade)` | Appends to upgrades JSON |
| `addDecoration(userId, decoration)` | Appends to decorations JSON |
| `delete(userId)` | Deletes workspace progression |

---

## 13. AI Service (`src/services/ai/ai-service.ts`)

**Singleton**: `aiService`

### Methods
All methods delegate to `AIEngine`:

| Method | Delegates To | Description |
|--------|-------------|-------------|
| `breakDownGoal(userId, goal)` | `aiEngine.breakDownGoal` | Returns mission breakdown |
| `generateMissions(userId, context)` | `aiEngine.generateMissionsFromContext` | Auto-generate missions |
| `generateWeeklyPlan(userId)` | `aiEngine.generateWeeklyPlan` | Weekly schedule |
| `generateDailyBriefing(userId)` | `aiEngine.generateDailyBriefing` | Morning briefing |
| `getCoaching(userId, question?)` | `aiEngine.getProductivityCoaching` | Coaching advice |
| `getMotivation(userId)` | `aiEngine.getMotivation` | Motivational quote |
| `getGenerationHistory(userId)` | Prisma query | Previous AI generations |
| `getProviderHealth()` | `aiEngine.checkProviderHealth` | Provider key status |

---

## Data Flow Summary

```
Client Store → Server Action → Service Method → Prisma
                                        ↓
                                   EventBus.emit()
                                        ↓
                              (Server-side event, no subscribers)
                                    
Client Store (after action resolves) → EventBus.emit() (client)
                                        ↓
                                   Audio Engine → Web Audio API
```
