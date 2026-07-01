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
<!-- END:anchored-summary -->
