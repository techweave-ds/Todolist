# Events — Complete Reference

## Event Bus Architecture

The EventBus is a **centralized Pub/Sub system** that enables loose coupling between modules. It's implemented as a singleton accessible from both client and server environments.

### Implementation (`src/core/events/event-bus.ts`)

```typescript
class EventBus {
  private handlers: Map<string, Map<HandlerId, EventHandler>>
  
  // Subscribe with auto-cleanup
  subscribe(type: string, handler: EventHandler): () => void  // Returns unsubscribe fn
  on(type: string, handler: EventHandler): () => void          // Alias for subscribe
  
  // Unsubscribe
  off(type: string, handler: EventHandler): void               // Remove by reference
  
  // One-shot
  once(type: string, handler: EventHandler): void              // Auto-removes after fire
  
  // Emit (async, fault-tolerant)
  emit(event: AppEvent): Promise<void>                         // Promise.allSettled
}
```

**Key design decisions:**
- Async handlers: `emit()` awaits all handlers with `Promise.allSettled` — one failure doesn't block others
- Memory-safe: `subscribe`/`on` return an unsubscribe function for cleanup
- `off()` uses reference equality for removal
- `once()` wraps the handler to auto-remove after first fire

---

## Event Type System

All events and their payloads are defined in `src/core/types/index.ts`:

```typescript
AppEvent =
  | { type: MissionEventType; payload: { missionId: string; userId: string; data?: unknown } }
  | { type: CampaignEventType; payload: { campaignId: string; userId: string; data?: unknown } }
  | { type: XPEventType; payload: { userId: string; amount: number; totalXP: number; level: number; data?: unknown } }
  | { type: AchievementEventType; payload: { userId: string; achievementKey: string; achievementTitle: string; data?: unknown } }
  | { type: StreakEventType; payload: { userId: string; currentStreak: number; longestStreak: number; data?: unknown } }
  | { type: FocusEventType; payload: { userId: string; sessionId: string; duration: number; completed: boolean; data?: unknown } }
  | { type: AppEventType; payload: { userId: string; data?: unknown } }
```

### Type Breakdown

| Category | Type Alias | Event String Values |
|----------|-----------|-------------------|
| Mission | `MissionEventType` | `MISSION_CREATED`, `MISSION_UPDATED`, `MISSION_COMPLETED`, `MISSION_DELETED` |
| Campaign | `CampaignEventType` | `CAMPAIGN_CREATED`, `CAMPAIGN_UPDATED`, `CAMPAIGN_COMPLETED` |
| XP | `XPEventType` | `XP_GAINED`, `LEVEL_UP` |
| Achievement | `AchievementEventType` | `ACHIEVEMENT_UNLOCKED` |
| Streak | `StreakEventType` | `STREAK_UPDATED` |
| Focus | `FocusEventType` | `FOCUS_STARTED`, `FOCUS_ENDED` |
| App | `AppEventType` | `DAILY_BRIEFING_OPENED`, `REWARD_CAPSULE_OPENED` |

---

## Event Flow (Bidirectional)

Events are emitted on **both server and client** in some flows:

### Server-Side Emissions
Emitted by service methods during Prisma operations:

| Event | Emitted By | When |
|-------|-----------|------|
| `MISSION_CREATED` | `missionService.create` | After mission created in DB |
| `MISSION_UPDATED` | `missionService.update` | After mission updated (non-completion) |
| `MISSION_COMPLETED` | `missionService.update` | When status set to 'completed' |
| `MISSION_DELETED` | `missionService.delete` | After mission deleted |
| `CAMPAIGN_CREATED` | `campaignService.create` | After campaign created |
| `CAMPAIGN_UPDATED` | `campaignService.update` | After campaign updated (non-completion) |
| `CAMPAIGN_COMPLETED` | `campaignService.update` | When status set to 'completed' |
| `XP_GAINED` | `xpService.awardXP` | After XP transaction + progress upsert |
| `LEVEL_UP` | `xpService.awardXP` | When new level > previous level |
| `ACHIEVEMENT_UNLOCKED` | `achievementService.unlockAchievement` | After achievement unlocked + XP awarded |
| `STREAK_UPDATED` | `streakService.updateStreak` | After streak changed |
| `FOCUS_STARTED` | `focusService.startSession` | After session created |
| `FOCUS_ENDED` | `focusService.endSession` | After session ended + stats updated |
| `REWARD_CAPSULE_OPENED` | `rewardService.processMissionCompletion` | After all rewards processed |

### Client-Side Emissions
Emitted by store methods after server action resolves:

| Event | Emitted By | When |
|-------|-----------|------|
| `MISSION_COMPLETED` | `missionStore.completeMission` | After server returns success |
| `XP_GAINED` | `missionStore.completeMission` | After server returns (with dummy totalXP/level) |
| `REWARD_CAPSULE_OPENED` | `missionStore.completeMission` | After server completes |
| `LEVEL_UP` | `missionStore.completeMission` | If rewardEvents.leveledUp |
| `ACHIEVEMENT_UNLOCKED` | `missionStore.completeMission` | If rewardEvents.achievementUnlocked |
| `STREAK_UPDATED` | `missionStore.completeMission` | If rewardEvents.streakChanged |
| `FOCUS_STARTED` | `focusStore.startSession` | After server returns session |
| `FOCUS_ENDED` | `focusStore.endSession` | After server returns session |

---

## Subscriber Registry

All subscribers are registered in `audioEngine.setupEventSubscriptions()`:

```typescript
eventBus.subscribe('MISSION_COMPLETED',  async () => playEffect('mission_complete'))
eventBus.subscribe('MISSION_CREATED',    async () => playEffect('notification'))
eventBus.subscribe('MISSION_DELETED',    async () => playEffect('notification'))
eventBus.subscribe('CAMPAIGN_CREATED',   async () => playEffect('notification'))
eventBus.subscribe('CAMPAIGN_COMPLETED', async () => playEffect('campaign_complete'))
eventBus.subscribe('LEVEL_UP',           async () => playEffect('level_up'))
eventBus.subscribe('ACHIEVEMENT_UNLOCKED', async () => playEffect('achievement'))
eventBus.subscribe('XP_GAINED',          async () => playEffect('xp_gain'))
eventBus.subscribe('FOCUS_STARTED',      async () => playEffect('focus_start'))
eventBus.subscribe('FOCUS_ENDED',        async () => playEffect('focus_end'))
eventBus.subscribe('STREAK_UPDATED',     async () => playEffect('streak_updated'))
eventBus.subscribe('REWARD_CAPSULE_OPENED', async () => playEffect('capsule_open'))
```

No other components subscribe to events. Business logic is handled through direct service calls (not events).

---

## Event Flow Diagrams

### Mission Completion (Full Chain)

```
User clicks checkbox
  │
  ▼
missionStore.completeMission(id, userId)          [CLIENT]
  │
  ├──→ completeMissionAction(id, userId)          [SERVER]
  │     │
  │     ├──→ missionService.complete(id, userId)
  │     │     └──→ prisma.mission.update({ status: 'completed' })
  │     │     └──→ prisma.missionHistory.create({ action: 'completed' })
  │     │     └──→ eventBus.emit(MISSION_COMPLETED)    ← server-side (no subscribers)
  │     │
  │     └──→ rewardService.processMissionCompletion(userId, id, difficulty)
  │           │
  │           ├──→ xpService.awardXP(userId, amount, 'mission_completed')
  │           │     └──→ prisma.$transaction
  │           │     └──→ eventBus.emit(XP_GAINED)      ← server-side (no subscribers)
  │           │     └──→ eventBus.emit(LEVEL_UP?)       ← server-side (no subscribers)
  │           │
  │           ├──→ streakService.updateStreak(userId)
  │           │     └──→ eventBus.emit(STREAK_UPDATED?) ← server-side
  │           │
  │           ├──→ achievementService.checkAndUnlock(userId)
  │           │     └──→ eventBus.emit(ACHIEVEMENT_UNLOCKED?) ← server-side
  │           │
  │           ├──→ notificationService.create(levelUp/achievement)
  │           ├──→ memoryLaneService.addEntry(levelUp/achievement)
  │           └──→ eventBus.emit(REWARD_CAPSULE_OPENED) ← server-side
  │
  └── (after server resolves)
      │
      ├──→ eventBus.emit(MISSION_COMPLETED)       [CLIENT] → audio: mission_complete
      ├──→ eventBus.emit(XP_GAINED)               [CLIENT] → audio: xp_gain
      ├──→ eventBus.emit(REWARD_CAPSULE_OPENED)   [CLIENT] → audio: capsule_open
      ├──→ IF leveled: eventBus.emit(LEVEL_UP)    [CLIENT] → audio: level_up
      ├──→ IF achievement: eventBus.emit(ACHIEVEMENT_UNLOCKED) → audio: achievement
      └──→ IF streak: eventBus.emit(STREAK_UPDATED) [CLIENT] → audio: streak_updated
```

### Focus Session

```
Start:
  focusStore.startSession(input, userId)
    → startFocusSessionAction → focusService.startSession
      → prisma.focusSession.create
      → eventBus.emit(FOCUS_STARTED) [SERVER]
    → eventBus.emit(FOCUS_STARTED) [CLIENT] → audio: focus_start

End:
  focusStore.endSession(id, userId, duration, completed, distractions)
    → endFocusSessionAction → focusService.endSession
      → prisma.$transaction (update session + stats)
      → eventBus.emit(FOCUS_ENDED) [SERVER]
    → eventBus.emit(FOCUS_ENDED) [CLIENT] → audio: focus_end
```

---

## Event Diagram (Text)

```
                    ┌─────────────────────────┐
                    │     EventBus             │
                    │  (Singleton Pub/Sub)     │
                    └──────────┬──────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
    │ Audio Engine  │  │ (future)      │  │ (future)      │
    │ 12 subscribers│  │ Notification  │  │ Analytics     │
    │ → playEffect  │  │ UI component  │  │ persistence   │
    └───────────────┘  └───────────────┘  └───────────────┘
```

Currently, only the Audio Engine has active subscribers. All other business logic (notifications, memory lane, analytics, streaks, achievements, XP) is handled through direct service calls in the server actions, not through events.
