# Resume Portfolio

Static resume portfolio site built with React + Vite + TypeScript. No backend — resume data lives in a JSON file.

## Setup

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build        # Output in dist/
```

Deploy `dist/` to GitHub Pages. The `base` path is configured for `/Resume-Portfolio/`.

## Update Resume

Edit `public/data/resume.json` directly — no admin UI needed.

## Tech Stack

- React 19 + TypeScript
- Vite (build + dev server)
- React Router (2 pages: Landing + Resume)
- CSS custom properties (Cobalt Blue theme)
- GitHub Pages (static deploy)

## Pages

- `/` — Landing page (Hero, Stats, Summary, Contact, Experience, Education, Skills, Certifications, Projects)
- `/resume` — ATS-friendly printable resume (Ctrl+P to print/save PDF)
