# Mission Control OS — Creative Direction & Narrative

## Core Emotion
**Purpose, momentum, control, focus, achievement.** Every UI element should feel like it belongs in a starship cockpit or mission operations center. The user is a Commander; tasks are Missions; groups are Campaigns; progress is XP and Rank.

## Narrative Themes

### The Commander Identity
- **Greeting**: "Good morning/afternoon/evening, Commander" — time-aware, humanizing
- **Avatar**: Gradient initial badge in header (currently hardcoded "U")
- **Rank system**: Cadet → Operator → Tactician → Strategist → Commander → Elite → Legend → Icon
- **Readiness Score**: 0-100% metric on dashboard — "Optimal" / "Ready" / "Warming Up" / "Needs Activation"

### Military / Ops Vocabulary Map

| App Term | Narrative Equivalent |
|----------|---------------------|
| User | Commander |
| Task | Mission |
| Create task | Deploy Mission |
| Task group | Campaign |
| Priority | Priority (Critical → Low) |
| Difficulty | Difficulty (Easy → Legendary) |
| Complete | Complete / Extract |
| Delete | Scrub / Archive |
| Progress | Readiness / Momentum |
| Streak | Streak (unchanged — fits) |
| Focus timer | Focus Session |
| Workspace | Command Center / Bridge |
| Settings | Systems Config |
| Empty state | "No missions deployed" / "Your queue is empty" |
| Loading | "SYSTEM ONLINE" badge in header |

### The Dashboard as Command Center
The dashboard (`src/app/(app)/dashboard/`) is the user's primary ops interface:
- **MissionHero** — Top section with greeting + readiness meter + live status strip (active missions, focus sessions, streak, completed today)
- **Readiness Score** — Composite metric: `activeMissions*25 + focusSessions*20 + completedToday*25 + recentXP*15 + streakDays*15` (clamped 0–100)
- **Stat cards** — Animated underline on hover
- **Content columns** — Left (briefing + missions + campaigns) : Right (profile + achievements + weekly plan)

## Visual Language

### Typography Direction
- System font stack for reliability
- `.text-gradient` for the app name "Mission Control" in sidebar — purple-to-magenta gradient
- Numbers in `tabular-nums` for XP, levels, stats

### Color Psychology
- **Purple primary** (`oklch 0.65 0.25 280`) — authority, mystery, command
- **Pink-magenta accent** (`oklch 0.7 0.25 320`) — energy, achievement
- **Amber** (`text-amber-400`) — streak/urgency
- **Emerald** (`text-emerald-400`) — focus/completion
- **Red pulse** (`bg-red-500 animate-pulse-glow`) — critical priority, demands attention
- **Background** near-black indigo — deep space / cockpit dark

### Glassmorphism Rationale
Every panel uses `.glass` or `.glass-strong` — frosted glass over the GlowBackground canvas creates depth. Users perceive "looking through" data panels at a live, breathing HUD background.

### Ambient Background
The `<GlowBackground>` component (`src/components/ui/glow-background.tsx`) renders a full-viewport `<canvas>` with:
- 4 radial gradient orbs (purple, pink, blue, magenta at 8-15% opacity)
- Orbs follow mouse position with smooth interpolation
- Orbs orbit slowly over time (t = 0.003 per frame)
- `mix-blend-mode: screen` for ethereal glow
- `pointer-events: none` so it never blocks interaction

This replaces any need for explicit "particle" effects — the soft glow is more restrained and performant.

## Micro-interactions & Polish

| Interaction | Implementation |
|------------|---------------|
| Page entry stagger | Framer Motion variant stagger (80ms delay) |
| Card hover lift | `hover:scale-[1.02]` on quick action cards |
| Stat card underline | `w-0 group-hover:w-full bg-{color}/30 transition-all duration-500` |
| Button gradients | SVG icon backgrounds with `bg-gradient-to-br` |
| Priority indicator | Small colored dot, critical gets `animate-pulse-glow` |
| Active nav bar | Left border indicator (`absolute left-0 w-0.5 h-5 rounded-full bg-gradient-to-b from-primary to-accent`) |
| System status | Green dot in header with `animate-pulse-glow` + "SYSTEM ONLINE" |
| XP gain | `XpDisplay` component — number floats up + fades out (Framer AnimatePresence) |
| Hover panel glow | `group-hover:opacity-100` overlay gradients |

## Tone of Copy

All text should match the narrative:

| Context | Example |
|---------|---------|
| Empty state | "Your mission queue is empty. Intelligence reports no active objectives. Deploy your first mission to begin your campaign." |
| Dashboard subtitle | "Your command center is online. All systems nominal — ready to track missions, monitor progress, and execute your objectives." |
| Achievement empty | "Complete missions to earn achievements and climb the ranks." |
| Campaign empty | "No campaigns yet. Start a campaign to track progress across multiple missions." |
| Error | "Systems offline. Unable to connect to command database." (future) |

## Future Creative Directions
- **Sound design**: UI clicks as console button presses, XP gain as ascending chime, mission complete as success tone
- **HUD elements**: Scan line overlay on loading, corner brackets on modals, grid overlay on workspace
- **Rank ceremony**: Animated unlock sequence when ranking up (modal with particle burst)
- **Mission briefing**: Full-screen AI-generated briefing on first daily visit
- **Avatar customization**: Unlockable via achievements
