# Resume Portfolio

A personal resume portfolio with an admin panel for editing resume data through a browser UI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 7 |
| **Routing** | React Router 7 (SPA) |
| **Styling** | CSS custom properties (Cobalt Blue theme) |
| **Auth** | Firebase Auth (Google sign-in) |
| **Persistence** | GitHub Contents API (commits `resume.json` directly to repo) |
| **Hosting** | GitHub Pages (GitHub Actions deploy) |
| **Domain** | ashlock-tech.my |

### Why No Database?

Resume data lives in `public/data/resume.json`. The admin panel reads/writes this file via the GitHub Contents API — each save is a git commit. GitHub Pages auto-rebuilds on push. Zero infrastructure cost.

### API & Service Costs

| Service | Cost | Limits |
|---------|------|--------|
| **GitHub API** | Free | 5,000 authenticated requests/hour |
| **GitHub Pages** | Free (public repo) | 100 GB bandwidth/month |
| **Firebase Auth** | Free (Spark plan) | 10,000 monthly active users |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — Hero, Stats, Summary, Contact, Experience, Education, Skills, Certifications, Projects |
| `/resume` | ATS-friendly printable resume (Ctrl+P to print/save PDF) |
| `/login` | Admin login (Google sign-in) |
| `/admin` | Admin panel — tabbed editor for all resume sections |

## Project Structure

```
src/
├── auth/                    # Firebase Auth (init, context, route guard)
├── components/
│   ├── admin/               # Admin editors (Profile, Experience, Education, Skills, Certs, Projects)
│   │   └── ArraySectionEditor.tsx   # Generic reusable list editor
│   ├── PublicLayout.tsx      # Public route wrapper (Navbar + Outlet + Footer)
│   └── ...                   # Landing components (Hero, Contact, Skills, etc.)
├── hooks/
│   ├── useResume.ts          # Fetch resume.json for public pages
│   └── useGitHubPat.ts       # sessionStorage PAT management
├── pages/
│   ├── Landing.tsx           # Home page
│   ├── Resume.tsx            # ATS resume view
│   ├── Login.tsx             # Google sign-in
│   └── Admin.tsx             # Tabbed admin panel
├── services/
│   └── github.ts             # GitHub Contents API (fetch + commit)
├── styles/                   # CSS (base, landing, resume, admin, print)
└── types/
    └── resume.ts             # TypeScript interfaces
```

## Setup

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
VITE_FIREBASE_API_KEY=        # Firebase Console → Project Settings → Web App
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=             # Google account email for admin access
```

### GitHub PAT

Create a fine-grained Personal Access Token:
1. GitHub → Settings → Developer Settings → Fine-grained tokens
2. Repository access: **Only select repositories** → `Resume-Portfolio`
3. Permissions: **Contents** → Read and Write
4. The PAT is entered per-session in the admin panel (stored in `sessionStorage` only)

## Development

```bash
npm run dev          # Start dev server
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint
```

## Deployment

Automated via GitHub Actions — push to `main` triggers build and deploy to GitHub Pages.

Custom domain setup: see `docs/github-pages-custom-domain-setup.html`.
