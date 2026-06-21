# Workplan — Tech-Savvy anime.js Complete Revamp

**Project**: Resume-Portfolio (React 19 + TS + Vite 7)
**Goal**: Complete revamp with anime.js v4 motion — developer/terminal aesthetic, within the existing Baker Street Dark theme. All motion gated behind `prefers-reduced-motion` + print kill-switch. Keep the 5-click secret admin untouched.
**Started**: Sun Jun 21, 2026
**anime.js**: v4.4.1 (named exports, ships own types — no @types needed)

```
ARCHITECTURE
  src/lib/motion.ts          prefersReducedMotion() + REVEAL/DUR/EASE tokens
  src/components/Reveal.tsx   IntersectionObserver + anime.js scroll-reveal wrapper
  src/hooks/useCountUp.ts     number 0→N on view
  src/components/Typewriter.tsx  terminal typing + blink cursor (pure React)
  src/components/CodeBackground.tsx  animated dot-matrix canvas (Phase 2)
  src/styles/motion.css       initial states, cursor, .term-title, .code-bg, KILL-SWITCH
                              (imported LAST in App.tsx so kill-switch wins)
```

## Phases

- [x] **Phase 0 — Foundation** (motion layer) — DONE, tsc clean
  - [x] 0.1 npm i animejs@^4 → 4.4.1
  - [x] 0.2 lib/motion.ts
  - [x] 0.3 components/Reveal.tsx
  - [x] 0.4 hooks/useCountUp.ts
  - [x] 0.5 components/Typewriter.tsx
  - [x] 0.6 styles/motion.css + import in App.tsx (uses generic [data-anim] marker)
- [x] **Phase 1 — Hero** — DONE, tsc clean
  - typewriter title · count-up stats (StatNumber sub-component) · entrance timeline (image→name→CTA) · 5-click admin preserved
- [x] **Phase 2 — Background ambiance** — DONE
  - CodeBackground.tsx canvas dot-matrix + gold wave; mounted in PublicLayout; body transparent + hero transparent so the fixed canvas shows
- [x] **Phase 3 — Scroll-reveal sweep** — DONE (Landing)
  - Landing sections (Summary/Contact/Experience/Education/Skills/Certifications/Projects + dynamic) wrapped in <Reveal>; "> " prompt prefix on .section-title. Resume per-section DOM left untouched (print safety).
- [x] **Phase 4 — Skill tech-tag chips** — DONE
  - Skills.tsx items stagger ([data-reveal-item]); Resume comma-string → animated .resume-skill-chip pills. Fixed Reveal: wrapper stays visible in stagger mode.
- [x] **Phase 5 — Card + Showcase pages** — DONE
  - Showcase featured-grid + compact-grid stagger; Card contact links stagger
- [~] **Phase 6 — Guardrails + verify** — build/lint DONE; eye-check + cross-AI + commit PENDING
  - [x] tsc -b clean · vite build clean (146 modules, 2.88s)
  - [x] eslint: my files clean; 2 PRE-EXISTING errors remain (AuthContext.tsx:52, Hero.tsx computeStats — react-refresh/only-export-components, baseline, NOT introduced here)
  - [x] kill-switch covers print + prefers-reduced-motion (motion.css)
  - [ ] Tuan eye-check via `npm run dev` (motion can't be verified headless — virtual-time freezes anims)
  - [ ] /jk + /suzaku cross-AI review
  - [ ] /commit (Tuan's git call — MemoryCore/project repos)

## Notes / decisions
- `[data-anim]` = "JS animates this in" (starts hidden, no flash, kill-switch forces visible).
- `[data-reveal]` (wrapper) + `[data-reveal-item]` (staggered children) = scroll-reveal initial state.
- Typewriter is pure React (discrete char timer) — no anime.js dependency for it.
- Reduced-motion path: JS effects short-circuit + CSS kill-switch forces full visibility. PDF print path (print.css) inherits the kill-switch.
- Cross-AI review (/jk + /suzaku) + build/test gates before /commit (Geass).
