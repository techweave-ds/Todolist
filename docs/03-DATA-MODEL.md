# Data Model — Prisma Schema

## 18 Database Models

### Entity Relationship Diagram (Text)

```
User (1) ─── (0/1) Profile
  │          (0/*) Campaign ─── (0/*) Mission ─── (0/*) Subtask
  │          (0/*) MissionHistory
  │          (0/*) XPTransaction
  │          (0/1) UserProgress
  │          (0/*) UserAchievement ─── Achievement
  │          (0/*) Streak
  │          (0/*) FocusSession
  │          (0/1) FocusStatistic
  │          (0/*) Notification
  │          (0/1) AudioPreference
  │          (0/1) WorkspaceProgression
  │          (0/*) MemoryLane
  │          (0/*) AnalyticsEvent
  │          (0/*) AIGeneration
```

---

## Detailed Model Reference

### User
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | Primary key |
| email | String | required | Unique |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

**Relations**: Has one Profile, has many Campaigns, Missions, XPTransactions, UserProgress records, UserAchievements, Streaks, FocusSessions, FocusStatistic (0/1), Notifications, AudioPreference (0/1), WorkspaceProgression (0/1), MemoryLane entries, AnalyticsEvents, AIGenerations.

---

### Profile
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | unique | FK → User (Cascade) |
| displayName | String? | nullable | |
| avatarUrl | String? | nullable | |
| bio | String? | nullable | |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

---

### Campaign
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | required | FK → User (Cascade) |
| title | String | required | |
| description | String? | nullable | |
| emoji | String? | nullable | Display emoji |
| color | String? | nullable | Hex color |
| status | String | "active" | "active" \| "completed" \| "archived" |
| deadline | DateTime? | nullable | |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

**Indexes**: `[userId]`, `[status]`

---

### Mission
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | required | FK → User (Cascade) |
| campaignId | String? | nullable | FK → Campaign (SetNull on delete) |
| title | String | required | |
| description | String? | nullable | |
| priority | String | "medium" | "low" \| "medium" \| "high" \| "critical" |
| difficulty | String | "medium" | "easy" \| "medium" \| "hard" \| "legendary" |
| status | String | "pending" | "pending" \| "active" \| "completed" \| "archived" |
| deadline | DateTime? | nullable | |
| estimatedTime | Int? | nullable | Minutes |
| xpReward | Int | 0 | Calculated from difficulty |
| category | String? | nullable | Custom category label |
| tags | String[] | [] | Comma-separated tags |
| dependencies | String[] | [] | Mission IDs this depends on |
| progress | Int | 0 | 0-100 |
| order | Int? | nullable | Display order |
| completedAt | DateTime? | nullable | |
| remindAt | DateTime? | nullable | Calculated from deadline - remindBefore |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

**Indexes**: `[userId]`, `[campaignId]`, `[status]`, `[priority]`

---

### Subtask
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| missionId | String | required | FK → Mission (Cascade) |
| title | String | required | |
| completed | Boolean | false | |
| order | Int? | nullable | |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

**Index**: `[missionId]`

---

### MissionHistory
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| missionId | String | required | |
| userId | String | required | |
| action | String | required | "created" \| "updated" \| "completed" \| "archived" \| "deleted" |
| data | Json? | nullable | Input snapshot at time of action |
| createdAt | DateTime | now() | |

**Indexes**: `[missionId]`, `[userId]`, `[createdAt]`

---

### XPTransaction
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | required | FK → User (Cascade) |
| amount | Int | required | Positive for gain, negative for spend |
| reason | String | required | See reason types below |
| referenceId | String? | nullable | Links to mission_id, achievement_id, etc. |
| metadata | Json? | nullable | |
| createdAt | DateTime | now() | |

**Reason types**: `mission_completed`, `achievement_unlocked`, `streak_bonus`, `focus_bonus`, `campaign_bonus`, `daily_bonus`

**Indexes**: `[userId]`, `[createdAt]`

---

### UserProgress
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | unique | FK → User (Cascade) |
| level | Int | 1 | Calculated from totalXP |
| totalXP | Int | 0 | Lifetime XP |
| currentXP | Int | 0 | XP toward next level |
| xpToNextLevel | Int | 100 | XP required for next level |
| totalMissionsCompleted | Int | 0 | |
| totalFocusMinutes | Int | 0 | |
| longestStreak | Int | 0 | |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

**Index**: `[level]`

---

### Achievement
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| key | String | unique | Machine-readable key |
| title | String | required | Display title |
| description | String? | nullable | |
| emoji | String? | nullable | Display emoji |
| rarity | String | "common" | "common" \| "rare" \| "epic" \| "legendary" |
| xpReward | Int | 0 | XP awarded on unlock |
| condition | Json? | nullable | Unlock condition definition |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

---

### UserAchievement
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | required | FK → User (Cascade) |
| achievementId | String | required | FK → Achievement (Cascade) |
| progress | Int | 0 | 0-100 |
| unlocked | Boolean | false | |
| unlockedAt | DateTime? | nullable | |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

**Unique**: `[userId, achievementId]`

---

### Streak
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | required | FK → User (Cascade) |
| currentStreak | Int | 0 | |
| longestStreak | Int | 0 | |
| lastActivityDate | DateTime? | nullable | |
| streakType | String | "daily" | "daily" \| "weekly" |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

**Unique**: `[userId, streakType]`

---

### FocusSession
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | required | FK → User (Cascade) |
| type | String | "pomodoro" | "pomodoro" \| "custom" \| "deep_focus" |
| duration | Int | required | Planned duration in minutes |
| actualDuration | Int? | nullable | Actual duration in minutes |
| completed | Boolean | false | |
| score | Int? | nullable | 0-100 focus score |
| distractions | Int | 0 | |
| environment | String? | nullable | Ambient environment used |
| notes | String? | nullable | |
| startedAt | DateTime | required | |
| endedAt | DateTime? | nullable | |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

**Indexes**: `[userId]`, `[startedAt]`

---

### FocusStatistic
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | unique | FK → User (Cascade) |
| totalSessions | Int | 0 | |
| totalMinutes | Int | 0 | |
| averageScore | Float | 0 | 0.0 |
| longestSession | Int | 0 | In minutes |
| currentStreak | Int | 0 | |
| bestStreak | Int | 0 | |
| weeklyMinutes | Int | 0 | |
| monthlyMinutes | Int | 0 | |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

---

### Notification
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | required | FK → User (Cascade) |
| type | String | required | "achievement" \| "streak" \| "reminder" \| "focus" \| "mission" \| "system" |
| title | String | required | |
| message | String? | nullable | |
| data | Json? | nullable | Payload (e.g., `{ missionId, remindAt }`) |
| read | Boolean | false | |
| createdAt | DateTime | now() | |

**Indexes**: `[userId, read]`, `[createdAt]`

---

### AudioPreference
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | unique | FK → User (Cascade) |
| masterVolume | Float | 0.8 | |
| musicVolume | Float | 0.7 | |
| sfxVolume | Float | 0.8 | |
| ambientVolume | Float | 0.5 | |
| voiceVolume | Float | 0.8 | |
| uiVolume | Float | 0.6 | |
| focusModeVolume | Float | 0.3 | |
| activeProfile | String | "default" | "default" \| "subtle" \| "intense" \| "premium" |
| currentEnvironment | String? | nullable | Ambient type |
| premiumPacks | String[] | [] | Unlocked premium packs |
| customSettings | Json? | nullable | |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

---

### WorkspaceProgression
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | unique | FK → User (Cascade) |
| level | Int | 1 | Workspace stage |
| theme | String | "neon-dreams" | Theme ID |
| upgrades | Json? | nullable | Unlocked upgrade IDs |
| ambiance | String? | nullable | Current ambiance mode |
| decorations | Json? | nullable | Placed decoration IDs |
| createdAt | DateTime | now() | |
| updatedAt | DateTime | auto | |

---

### MemoryLane
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | required | FK → User (Cascade) |
| type | String | required | "achievement" \| "milestone" \| "campaign_complete" \| "streak_record" \| "major_win" |
| title | String | required | |
| description | String? | nullable | |
| metadata | Json? | nullable | |
| date | DateTime | required | Date of event |
| significance | Int | 1 | 1-10 scale |
| createdAt | DateTime | now() | |

**Indexes**: `[userId]`, `[type]`, `[date]`

---

### AnalyticsEvent
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | required | FK → User (Cascade) |
| event | String | required | Event name |
| properties | Json? | nullable | Event payload |
| timestamp | DateTime | now() | |

**Indexes**: `[userId, event]`, `[timestamp]`

---

### AIGeneration
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | String (UUID) | auto | |
| userId | String | required | FK → User (Cascade) |
| type | String | required | "goal_breakdown" \| "mission_gen" \| "campaign_create" \| "weekly_plan" \| "daily_plan" \| "coaching" \| "motivation" |
| prompt | String | required | |
| response | String | required | |
| model | String | required | Model used (e.g., "gpt-4o", "claude-3-5-sonnet") |
| tokens | Int? | nullable | |
| metadata | Json? | nullable | |
| createdAt | DateTime | now() | |

**Indexes**: `[userId]`, `[type]`

---

## XP Calculation

```
Difficulty → Base XP:
  easy:       25 XP
  medium:     50 XP
  hard:      100 XP
  legendary: 250 XP

Total XP = baseXP × multiplier
multiplier = 1 + (streak × 0.1) + (focusBonus ? 0.2 : 0) + (campaignBonus ? 0.15 : 0)

Level progression:
  Level 1:    100 XP total
  Level 2:    250 XP total (100 + 150)
  Level N:    BASE_XP × SCALE_FACTOR^(N-1) per level
  Scale factor: 1.5
  Max level: 100
```

---

## Achievement Unlock Conditions (11 total)

| Key | Condition | Rarity | XP |
|-----|-----------|--------|-----|
| first_mission | Complete 1 mission | common | 25 |
| streak_7 | 7-day streak | common | 50 |
| streak_30 | 30-day streak | rare | 200 |
| missions_10 | Complete 10 missions | common | 50 |
| missions_50 | Complete 50 missions | rare | 200 |
| missions_100 | Complete 100 missions | epic | 500 |
| campaign_finisher | Complete 1 campaign | rare | 100 |
| focus_master | 10 focus sessions | common | 50 |
| focus_100 | 100 focus sessions | epic | 300 |
| level_5 | Reach level 5 | common | 50 |
| level_10 | Reach level 10 | rare | 150 |
| level_25 | Reach level 25 | legendary | 500 |
