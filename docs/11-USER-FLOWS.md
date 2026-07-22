# User Flows — Complete Reference

## 1. First-Time Onboarding

```
Landing Page
  │
  ├──→ "Get Started" → Sign Up
  │     └──→ Email + Password → Prisma User created
  │     └──→ Auto-login → Redirect to /app
  │
  └──→ "Sign In" → Login
        └──→ Email + Password → JWT cookie set
        └──→ Redirect to /app
```

### First Visit to `/app` (No Campaigns Yet)

```
/app (dashboard) renders:
  ├── Hero: "Welcome, commander! 🚀" + placeholder motivation quote
  ├── Active Missions: empty state "No missions yet. Start by creating a campaign!"
  ├── Progress: Level 1, XP 0/100, empty progress bar
  ├── Active Campaign: empty state "No active campaigns"
  ├── Quick Stats: 0 missions, 0 focus minutes, 0 streak
  ├── Streak: "Start your streak today!"
  └── Floating Action Button → "Create Mission" modal
        └── Enter title, description, difficulty, category, priority, tags
        └── Tags: typeahead (existing tags) + "Add new" chip
        └── Submit → missionStore.createMission → Server Action → DB
        └── Mission appears in Active Missions list
```

---

## 2. Daily Mission Flow

```
Daily Login → /app
  │
  ├── FAB opens → Create Mission modal
  │
  ├── Mission card → Complete (checkbox)
  │     └──→ missionStore.completeMission(id)
  │     └──→ Optimistic UI: mission dims, checkmark animates
  │     └──→ Server action completes
  │     └──→ Reward capsule animation (if enabled)
  │     └──→ XP popup: "+25 XP"
  │     └──→ Sound: mission_complete
  │     └──→ EventBus emits
  │     └──→ Streak updates
  │     └──→ Level up notification (if applicable)
  │     └──→ Achievement unlocked toast (if applicable)
  │
  ├── Mission card → Edit (pencil icon)
  │     └──→ EditMissionModal pre-filled with mission data
  │     └──→ Change title, description, difficulty, tags
  │     └──→ Submit → missionStore.updateMission(id, data)
  │
  ├── Mission card → Delete (trash icon)
  │     └──→ Confirmation modal
  │     └──→ Confirm → missionStore.deleteMission(id)
  │     └──→ Sound: notification
  │
  └── Mission card → Expand
        └──→ Full description, tags, timestamps, subtasks
```

---

## 3. Campaign Flow

### Create Campaign

```
Campaigns Page (/app/campaigns)
  │
  ├── "New Campaign" button → CreateCampaignModal
  │     └───→ Title, description, difficulty, tags
  │     └───→ Optional: missions[] (select existing + add new)
  │     └───→ Submit → campaignStore.createCampaign
  │     └───→ Redirect to campaign detail page
  │
  └── Campaign card → Click → /campaigns/[id]
        ├── Campaign header (title, progress bar, XP reward, difficulty badge)
        ├── Mission list (sorted by orderIndex)
        │     ├── Each mission: checkbox, title, difficulty, tags
        │     └── Drag handle → reorder (autosave)
        ├── "+" → AddMissionToCampaignModal → selects existing or creates new
        └── "Complete Campaign" button
              └───→ All missions must be done
              └───→ Confirmation → campaignStore.completeCampaign
              └───→ Sound: campaign_complete
              └───→ Popup: campaign completion summary
```

---

## 4. Focus Session Flow

### Start Focus

```
Focus Page (/app/focus)
  │
  ├── Timer mode selector: [Focus Timer | Stopwatch]
  ├── Duration selector: 15, 25, 30, 45, 60 min (or custom input)
  ├── Ambient selector: deep focus, light focus, rain, forest, etc.
  │
  ├── "Start Focus" → confirmation popup
  │     └───→ focusStore.startSession({ duration, ambient })
  │     └───→ Timer begins countdown
  │     └───→ Sound: focus_start
  │     └───→ Ambient starts playing
  │     └───→ Navigation disabled (blocked by state)
  │     └───→ "Are you sure?" → Cancel = end session, Continue = stay
  │
  ├── During session:
  │     ├── Timer display (minutes:seconds, large font)
  │     ├── Progress ring (circular countdown)
  │     ├── Ambient selector (dropdown, changes mid-session)
  │     ├── Distraction count (button: "+1 distraction")
  │     └── "Cancel" button → end session prematurely
  │
  └── Timer reaches 0
        └───→ Sound: focus_end
        └───→ Vibration notification (if supported)
        └───→ focusStore.endSession(id, duration, completed: true, distractions)
        └───→ Summary modal:
              ├── Duration badge
              ├── Distractions count
              ├── Focus score (if applicable)
              └── "Complete" → redirect to /app
```

---

## 5. Daily Briefing Flow

```
Daily Briefing (triggered on first /app visit each day)
  │
  ├── BriefingStore.openBriefing() → checks last seen date
  │
  ├── BriefingModal renders:
  │     ├── Greeting: "Morning, Commander!" (personalized)
  │     ├── Today's stats: pending missions, streak, level
  │     ├── AI-generated summary (if AI configured)
  │     │     └─── From generateDailyBriefing(userId)
  │     │     └─── Encouragement + priority summary
  │     └── "Let's Go!" button → dismiss, mark as seen
  │
  └── Persisted: UserProfile.dailyBriefingLastSeen = today
```

---

## 6. Settings Flow

```
Settings Page (/app/settings)
  │
  ├── Profile Section
  │     ├── Display name (editable text input)
  │     ├── Avatar color (color picker)
  │     └── Timezone (dropdown)
  │
  ├── Audio Section
  │     ├── Master volume slider
  │     ├── SFX volume slider
  │     ├── Ambient volume slider
  │     ├── Sound profile selector [Default, Subtle, Intense, Premium]
  │     └── Preview buttons per volume slider
  │
  ├── Rewards Section
  │     ├── Show celebration toggle
  │     └── Reward capsule animation toggle
  │
  ├── Focus Section
  │     └── Default focus duration (dropdown)
  │
  └── AI Section (conditional)
        ├── Provider health check display
        └── Preferred provider selector
```

---

## 7. XP & Leveling Flow

```
User completes mission or achieves something
  │
  ├── xpService.awardXP(userId, amount, source)
  │     ├── prisma.xpTransaction.create({ amount, source })
  │     ├── prisma.xpProgress.upsert({ totalXP: increment, currentLevel: recalculate })
  │     ├── If currentLevel > previous: eventBus.emit(LEVEL_UP)
  │     └── eventBus.emit(XP_GAINED)
  │
  ├── XP popup animation on dashboard (+25 XP, +50 XP, etc.)
  │
  └── Level up notification (if applicable):
        ├── Modal: "Level Up! You're now Level 3"
        ├── Sound: level_up
        ├── Workspace: new objects unlocked (if workspace system present)
        └── Highlight next level's XP requirement
```

---

## 8. Streak Flow

```
User completes any mission on a day
  │
  ├── streakService.updateStreak(userId)
  │     ├── Gets today's date (UTC)
  │     ├── Checks last active date
  │     ├── If yesterday → streak++
  │     ├── If today → no change (already counted)
  │     ├── If >1 day ago → streak resets to 1
  │     └── Updates UserProfile.currentStreak + longestStreak
  │
  ├── Dashboard streak display updates
  ├── Sound: streak_updated
  └── If milestone streak (7, 14, 30, 60, 90, 365):
        └── Achievement unlocked
```

---

## 9. Memory Lane Flow

```
MemoryLane Page (/app/memory-lane)
  │
  └── memoryLaneService.getAllEntries(userId)
        ├── Sorted by createdAt DESC
        ├── Each entry: type, title, description, metadata, icon, date
        ├── Entry types:
        │     ├── level_up: "Reached Level 5!"
        │     ├── achievement: "Unlocked 'Early Riser'"
        │     ├── focus_session: "Completed 25min deep focus"
        │     ├── campaign_complete: "Completed 'Learn Spanish'"
        │     └── mission_complete: "Completed 'Read Chapter 3'"
        └── Render: timeline UI with date groups
```

---

## 10. Error States

| Component | Loading State | Error State | Empty State |
|-----------|--------------|-------------|-------------|
| Dashboard | Skeleton cards (pulsing) | "Failed to load dashboard. Retry?" | "Welcome! Start by creating a mission." |
| Mission List | Skeleton rows | "Could not load missions" | "No missions yet. Tap + to create one." |
| Campaign List | Skeleton cards | "Could not load campaigns" | "No campaigns. Create your first campaign." |
| Focus Page | Centered spinner | "Focus timer unavailable" | — |
| Memory Lane | Skeleton timeline | "Could not load history" | "Your journey will appear here." |
| Settings | — | "Could not load preferences. Defaults applied." | — |
| Daily Briefing | Skeleton text | "Briefing unavailable. Check back later." | — |
| AI Coach | Typing indicator | "AI unavailable. Check provider settings." | "Ask me anything about productivity!" |
| Weekly Plan | Generating animation | "Could not generate plan. Try again." | — |
| Goal Breakdown | Generating animation | "Could not break down goal. Try again." | — |
