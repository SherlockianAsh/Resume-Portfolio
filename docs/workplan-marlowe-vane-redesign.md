# Workplan — Marlowe-Vane Redesign Port + Kanta Interaction

**Project**: Resume-Portfolio (React 19 + TS + Vite, JSONBin data, GitHub Pages → ashlock-tech.my)
**Goal**: Port the "Marlowe-Vane" noir-detective editorial design (Claude Design, `ref/Marlowe-Vane-Portfolio.html`) into the React app. KEEP the anime.js motion layer (re-point it). Add the signature **kanta (magnifying glass)** motif.
**Started**: Sun Jun 21, 2026 (planning)
**Builds on**: motion revamp commit `dcbe804` (motion layer stays)

## ⚠️ Ops constraints
- **Pushes auto-deploy live** (deploy.yml → GitHub Pages → ashlock-tech.my). Keep ALL redesign work LOCAL until complete + Tuan eye-checks. No partial pushes.
- `ref/` is gitignored (reference only, never committed).
- Geass: build+lint before commit, commit as Ash, no AI attribution, no force push.

## Design language (from ref)
- Palette: bg `#14110b` (warm near-black) · text `#e9e3d4` (cream) · accent `#c9a44c` gold · soft `#dcc488` · cards `#2a1215`/`#3a3122`
- Fonts: **Cormorant Garamond** (display serif) · **Spectral** (body serif) · **JetBrains Mono** (mono accents)
- Background: layered radial gradients (gaslight glow top-right + bottom-left) over `#14110b` — REPLACES the matrix canvas for this design
- Layout: 1160px centered · 110px section padding · gold hairline borders between sections
- Detective framing: Hero(Marlowe) → About("Observation is a discipline") → Methods(skills) → Cases(projects, as solved cases) → History(experience) → Contact

## Phases

- [ ] **Phase A — Design system foundation**
  - Load 3 Google fonts (index.html preconnect + link, or CSS @import)
  - New palette + type tokens in base.css (warm noir theme replaces Baker Street Dark)
  - Layered radial-gradient atmosphere; retire/replace CodeBackground matrix (keep component, swap visual) — decision: gradient bg, matrix off for this theme
  - Re-point motion.css tokens to new palette (gold #c9a44c)
- [ ] **Phase B — Hero redesign + Kanta #1 (photo lens)**
  - Marlowe-Vane hero composition; keep Typewriter title + entrance timeline (re-point)
  - <Kanta> component: circular lens over profile photo, magnified background-position, gold rim + glint, anime.js drift/scan; reduced-motion → static
- [ ] **Phase C — Section layout port**
  - About / Methods / Cases / History / Contact — 1160px, padding, gold hairlines
  - Keep <Reveal> scroll-reveal on each (re-point)
  - Section titles: serif display + mono kicker (port ref treatment)
- [ ] **Phase D — Cases + Kanta #2 (cursor-loupe)**
  - Projects → "Cases" casebook cards
  - Loupe follows cursor over case cards, reveals hidden detail (tech/outcome) under glass; pointer-only; touch → tap-to-expand; reduced-motion → plain hover/tap
- [ ] **Phase E — Data-model mapping**
  - experiences→History, skills→Methods, projects→Cases (label-level; keep data keys + JSONBin flow)
  - DynamicSection still handles unknown arrays
- [ ] **Phase F — Adapt remaining views + verify**
  - Card, Showcase, Resume (print stays clean), Analytics → new theme/type
  - Build + lint · eye-check (npm run dev) · /hone+/hunt · /suzaku (JK down) · /commit · (Tuan's call) push→deploy

## Notes
- Kanta = ONE reusable lens component, two placements (hero photo exam + cases evidence inspection).
- Motion layer (Reveal/useCountUp/Typewriter/motion.ts) carries over; only CodeBackground's visual changes.
- JK (Gemini) cross-AI is DOWN (free tier discontinued → Antigravity). Suzaku carries external review.
