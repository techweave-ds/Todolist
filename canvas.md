# Mission Control OS — Canvas & Layout Architecture

## Screen Canvas

The app uses a fixed 3-zone layout on authenticated pages (defined in `src/app/(app)/layout.tsx`):

```
┌──────────────────────────────────────────────┐
│  Header (fixed top-0 left-64, h-16)          │  ← SYSTEM ONLINE | date | [🔍 Cmd+K] 🔔 U
├──────────┬───────────────────────────────────┤
│ Sidebar  │  Main Content Area                 │
│ (fixed   │  (pl-64 pt-16, relative z-10)      │
│  left-0, │   ┌─────────────────────────────┐  │
│  w-64,   │   │  max-w-7xl mx-auto p-6       │  │
│  h-full) │   │  ┌───────────────────────┐  │  │
│          │   │  │  Page content         │  │  │
│ Mission  │   │  │  (varies by route)    │  │  │
│ Control  │   │  └───────────────────────┘  │  │
│ OS       │   └─────────────────────────────┘  │
│ v1.0     │                                     │
│          │                                     │
│ ───────  │                                     │
│ Dashboard│                                     │
│ Missions │                                     │
│ Campaigns│                                     │
│ Focus    │                                     │
│ ...      │                                     │
│ Settings │                                     │
└──────────┴─────────────────────────────────────┘
│  GlowBackground (fixed z-0, behind everything)  │
└──────────────────────────────────────────────────┘
```

## Z-Index Stack

| Layer | Component | Z |
|-------|-----------|---|
| Ambient | GlowBackground | 0 |
| Main | Main content | 10 |
| Header | Header (glass) | 30 |
| Sidebar | Sidebar (glass) | 40 |
| Overlay | CommandPalette, modals | 50+ |

## Dashboard Layout Detail

```
┌─────────────────────────────────────────────────┐
│ MissionHero                                      │
│ "Good morning, Commander"                  [80%] │
│ Your command center is online...           READY  │
│ 3 active missions | 2 focus sessions | ...        │
├─────────────────────────────────────────────────┤
│ [💫 Break Down Goal]  [💬 AI Coach]              │
├─────────────────────────────────────────────────┤
│ "What you focus on grows..." — AI motivation     │
├─────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│ │New Miss.│ │Focus    │ │Campaigns│ │Achieve. ││
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘│
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│ │Today: 5 │ │Streak 3d│ │Focus: 85│ │Awards: 2││
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘│
├────────────────────────┬────────────────────────┤
│ Col-span-3             │ Col-span-1              │
│ ┌────────────────────┐ │ ┌────────────────────┐ │
│ │ Daily Briefing      │ │ │ Commander Profile   │ │
│ │ (AI-generated text) │ │ │ [▲] Operator Lv.3 │ │
│ └────────────────────┘ │ │ XP ████████░░ 75%  │ │
│ ┌────────────────────┐ │ │ Total: 1,250 XP    │ │
│ │ Active Missions (2) │ │ │ Next: Tactician    │ │
│ │ ○ Mission A  🟡    │ │ └────────────────────┘ │
│ │ ○ Mission B  🔴    │ │ ┌────────────────────┐ │
│ └────────────────────┘ │ │ Recent Achieve.     │ │
│ ┌────────────────────┐ │ │ 🏆 First Mission   │ │
│ │ Campaign Progress   │ │ │ 🌟 3-Day Streak    │ │
│ │ 🚀 Onboarding 3/5  │ │ └────────────────────┘ │
│ │ ████████░░░░░░░░░  │ │ ┌────────────────────┐ │
│ └────────────────────┘ │ │ Weekly Planner      │ │
│                        │ │ [Generate]          │ │
│                        │ │ • Goal A            │ │
│                        │ │ • Goal B            │ │
│                        │ └────────────────────┘ │
└────────────────────────┴────────────────────────┘
```

## Missions Page Layout

```
┌─────────────────────────────────────────────────┐
│ Missions                            [All|Pending|Active|Completed] │
│                         [✨ Generate with AI] [＋ New Mission] │
├─────────────────────────────────────────────────┤
│ (optional slide-down create form)                │
├─────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────┐│
│ │ ○ Mission Title              🟡 Medium  +50XP││
│ │   Description line...                        ││
│ │   📅 due in 2d  ⏱ 30m                       ││
│ └──────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────┐│
│ │ ✓ Completed Mission          🟢 Easy   +25XP││
│ │   (strikethrough text)                       ││
│ └──────────────────────────────────────────────┘│
│ ...                                              │
│ OR (empty)                                       │
│ ┌──────────────────────────────────────────────┐│
│ │                                              ││
│ │         🎯 (Target icon)                     ││
│ │   No missions deployed                       ││
│ │   Your mission queue is empty...             ││
│ │        [Deploy Mission]                      ││
│ │                                              ││
│ └──────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

## Sidebar Navigation

| Icon | Label | Route | Active Indicator |
|------|-------|-------|-----------------|
| LayoutDashboard | Dashboard | `/dashboard` | Purple bar + glow |
| Target | Missions | `/missions` | Purple bar + glow |
| Flag | Campaigns | `/campaigns` | Purple bar + glow |
| Brain | Focus | `/focus` | Purple bar + glow |
| Trophy | Achievements | `/achievements` | Purple bar + glow |
| BarChart3 | Analytics | `/analytics` | Purple bar + glow |
| History | Memory Lane | `/memory-lane` | Purple bar + glow |
| — | — | — | — |
| Settings | Settings | `/settings` | Purple bar + glow |

## Header Elements

| Zone | Content |
|------|---------|
| Left | `■ SYSTEM ONLINE` (pulsing green dot) + date |
| Right | Search bar (Cmd+K) + Bell notification + Avatar initial |

## Empty State Contract

Every page that renders a list should use `<EmptyState>` (from `src/components/ui/empty-state.tsx`) when data is empty. Props:
- `icon`: ReactNode (typically a Lucide icon at `w-12 h-12`)
- `title`: string (mission-themed)
- `description`: string (narrative copy)
- `action?`: ReactNode (usually a button to create the first item)

## Auth Pages Layout

```
┌─────────────────────────────────────────────────┐
│          AuthLayout (centered flex)              │
│  Background gradient overlay                     │
│                                                  │
│       ┌──────────────────────────┐               │
│       │   glass-strong card      │               │
│       │   (max-w-md, rounded-2xl)│               │
│       │                          │               │
│       │   🚀 (icon)              │               │
│       │   Welcome back           │               │
│       │                          │               │
│       │   [Email]                │               │
│       │   [Password]             │               │
│       │   [Sign in]              │               │
│       │                          │               │
│       │   or continue with       │               │
│       │   [G] [GH] [✉]          │               │
│       │                          │               │
│       │   or explore             │               │
│       │   [Try Demo — No Sign Up]│               │
│       └──────────────────────────┘               │
└─────────────────────────────────────────────────┘
```
