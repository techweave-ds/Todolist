# Mission Control OS — Design System

## Identity
A dark, immersive "command center" aesthetic — glassmorphism panels over an animated ambient canvas, purple-primary accent palette, monospace-adjacent system font stack, and subtle particle/glow effects. The feeling is sci-fi ops room, not traditional SaaS.

## Theme Tokens

Defined in `src/app/globals.css:23-55` using OKLCH color space.

### Dark Mode (default, enforced via `<html className="dark">`)

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.08 0.02 280)` | Deep near-black indigo |
| `--foreground` | `oklch(0.95 0.01 280)` | Near-white text |
| `--primary` | `oklch(0.65 0.25 280)` | Purple (#8B5CF6 equiv.) |
| `--primary-foreground` | `oklch(0.98 0 0)` | White on primary |
| `--accent` | `oklch(0.7 0.25 320)` | Pink-magenta accent |
| `--accent-foreground` | `oklch(0.98 0 0)` | White on accent |
| `--muted` | `oklch(0.15 0.02 280)` | Subtle surface |
| `--muted-foreground` | `oklch(0.65 0.03 280)` | Secondary text |
| `--card` | `oklch(0.12 0.02 280 / 0.5)` | Glass card base |
| `--border` | `oklch(0.2 0.03 280)` | Subtle borders |
| `--ring` | `oklch(0.65 0.25 280)` | Focus rings |
| `--radius` | `0.75rem` | Rounded corners |

### Light Mode (defined but unused — all pages force dark via `<html className="dark">`)

## Glassmorphism System

Three core utility classes in `globals.css:116-138`:

- **`.glass`** — Standard panel: `rgba(0,0,0,0.2)` bg, 20px blur, subtle border. Used on cards, sidebar, header.
- **`.glass-strong`** — Elevated panel: `rgba(0,0,0,0.3)` bg, 30px blur, stronger border. Used on modals, auth cards.
- **`.mission-card`** — Hover-lift variant with translateY(-2px) + box-shadow.

## Typography

- **Font**: `system-ui, -apple-system, sans-serif` (San Francisco on macOS, Segoe UI on Windows)
- **Headings**: `font-bold tracking-tight` (e.g., `<h1 className="text-2xl font-bold">`)
- **Body**: `text-sm text-muted-foreground leading-relaxed`
- **Data**: `tabular-nums` class on numeric values (XP, stats, dates)
- **Accent titles**: `.text-gradient` class (linear-gradient from primary to accent, text clipped)

## Animation System

### CSS Keyframes (globals.css:69-112)

| Name | Duration | Use Case |
|------|----------|----------|
| `gradient-shift` | 8s | `.animate-gradient` — background gradients that breathe |
| `float` | 6s | `.animate-float` — floating decorative elements |
| `pulse-glow` | 3s | `.animate-pulse-glow` — critical priority dots, system status |
| `slide-up` | 0.5s | `.animate-slide-up` — page entry (deprecated in favor of Framer) |
| `slide-down` | 0.4s | `.animate-slide-down` — dropdowns, tooltips |
| `scale-in` | 0.3s | `.animate-scale-in` — modal entry |
| `breathe` | 4s | `.animate-breathe` — subtle opacity pulsing |
| `scan-line` | 8s | `.animate-scan-line` — HUD scan effect (decorative) |
| `data-pulse` | 2s | `.animate-data-pulse` — live data indicators |

### Framer Motion Patterns (used in `dashboard/page.tsx`)

- **Stagger container**: Parent `motion.div` with `variants={stagger}` — children animate in sequence with 80ms delay
- **FadeUp variant**: `{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }`
- Used on: stat cards, quick actions grid, content sections

## Component Hierarchy

```
AppLayout
├── GlowBackground           (canvas, fixed z-0, pointer-events-none)
├── SessionInitializer       (auth hydration, invisible)
├── Sidebar                  (fixed left, w-64, glass, nav items + active indicator)
├── Header                   (fixed top, left-64, glass, status bar + search + notifications)
├── <main>                   (pl-64 pt-16, relative z-10, max-w-7xl centered)
│   └── Page content
└── CommandPalette           (global Cmd+K modal)
```

### Page Compositions

#### Dashboard (Command Center)
```
MissionHero              → greeting, readiness score, stat strip
Action buttons           → Break Down Goal, AI Coach
Motivation quote         → AI-generated (conditional)
Quick Actions grid       → 4 cards: New Mission, Start Focus, View Campaigns, Achievements
Stat cards grid          → 4 cards: Today's Missions, Streak, Focus Score, Achievements
Content columns          → 3:1 split
├── Left (col-span-3)
│   ├── DailyBriefing    → AI-generated daily summary
│   ├── Active Missions  → mission list with priority dots
│   └── Campaign Progress → campaign bars
└── Right (col-span-1)
    ├── CommanderProfile → rank badge, XP bar, next rank
    ├── Recent Achievements → badge list
    └── WeeklyPlanner    → AI-generated weekly goals
Modals:
├── AICoach              → chat-style coaching
└── GoalBreakdown        → AI goal decomposition
```

#### Missions
```
Header          → title + filter tabs (All/Pending/Active/Completed) + "Generate with AI" + "New Mission"
Create form     → inline slide-down (conditional on ?create=true or button click)
Mission list    → glass cards with checkbox, title, priority dot, difficulty badge, metadata
Empty states    → "No missions deployed" (all filter) / "No {filter} missions" (per filter)
```

#### Other Pages (not yet transformed to mission identity)
- **Campaigns** — CRUD, progress bars
- **Focus** — Pomodoro timer, audio environments
- **Achievements** — Badge grid, progress
- **Analytics** — Charts (completion, focus, trends)
- **Memory Lane** — Historical scroll
- **Workspace** — 3D customization
- **Settings** — Audio mixer, preferences

## Responsive Strategy
- Sidebar: fixed at `w-64` on desktop, hidden on mobile (no mobile nav yet)
- Header: `left-64` offset matching sidebar
- Content: `max-w-7xl mx-auto p-6`
- Grids: `grid-cols-1` → `sm:grid-cols-2` → `md:grid-cols-4`
- Dashboard columns: `md:grid-cols-4` (3:1 split via `md:col-span-3`)
