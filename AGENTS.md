<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:anchored-summary -->
# Session Summary

## Audio Fix (fixed ASMR/ambient sounds too quiet)
- Boosted all sound effect volumes from 0.15-0.35 to 0.4-0.7 (mission_complete, level_up, achievement, xp_gain, focus_start/end, capsule_open, streak_updated, campaign_complete, daily_briefing, workspace_upgrade, notification)
- Boosted all ambient environment volumes (noise 0.03-0.2 → 0.12-0.45, drone 0.03-0.04 → 0.1-0.12, chirp 0.06 → 0.12)
- Added `AudioContext` resume on first user click/keydown in `(app)/layout.tsx`
- Added `resumeContext()` method to audio engine
- Added `getAnalyser()` method for audio reactivity visualizations
- Created `useAudioReactivity()` hook for frequency data

## Landing Page Redesign (Full cinematic overhaul)
- Replaced old static landing page with immersive cinematic experience
- Files created under `src/components/landing/`:
  - **`cursor.tsx`** — Custom cursor with glow trail, expands on interactive elements
  - **`particle-background.tsx`** — Three.js 3D particle system (2000 particles, mouse-reactive, color-gradated)
  - **`hero.tsx`** — Animated word-by-word title reveal ("Transform Your Digital Life"), floating geometric shapes, parallax scroll, CTA with animated gradient
  - **`features-bento.tsx`** — Bento grid layout (10 features in asymmetrical 4-column grid), hover lift + glow effects
  - **`sci-fi-showcase.tsx`** — Command center network visualization with connection lines, pulsing nodes, animated XP bar
  - **`manifesto.tsx`** — Four principles with scroll-reveal cards, stats counter bar
  - **`faq.tsx`** — Accordion FAQ with animated open/close
  - **`testimonials.tsx`** — Auto-rotating carousel with manual controls, gradient backgrounds
  - **`final-cta.tsx`** — CTA card with floating glow orbs, animated gradient button
- Navigation rebranded from "Mission Control OS" to "Quiet Panda"
- All sections use `framer-motion` scroll-triggered animations
- All sections are responsive

## Ian Xiaohei Illustrations Skill Integration
- Created opencode skill at `~/.config/opencode/skills/ian-xiaohei-illustrations/` based on [helloianneo/ian-xiaohei-illustrations](https://github.com/helloianneo/ian-xiaohei-illustrations) — Chinese hand-drawn illustration generation in Xiaohei style
- Skill includes: SKILL.md, style-dna.md, xiaohei-ip.md, composition-patterns.md, prompt-template.md, qa-checklist.md
- Generated 6 Xiaohei-style illustration briefs for Quiet Panda:
  - **01-missions.md** — 任务变任务书 (Workflow: sticky notes → mission machine → XP document)
  - **02-workspace.md** — 小黑工位长出来了 (Before/after: empty room → grown workspace with plants, monitors, trophies)
  - **03-ai-coach.md** — AI 拆目标 (Workflow: big goal ball → postbox machine → weekly plan blocks)
  - **04-focus.md** — 专注模式小黑戴头盔 (Mini comic: info bombardment → welding helmet deep flow)
  - **05-xp-level.md** — XP 升级梯子 (Metaphor: curved ladder with XP rungs, 小黑 climbing)
  - **06-memory-lane.md** — 小黑回头看 (Map route: winding path of milestones, 小黑 looking back)
- Prompts saved to `public/illustrations/` for direct use with image generators
<!-- END:anchored-summary -->
