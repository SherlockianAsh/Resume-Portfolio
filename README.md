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
| **Persistence** | JSONBin.io (public bin for read, Master Key for admin writes) |
| **Hosting** | GitHub Pages (GitHub Actions deploy) |
| **Domain** | ashlock-tech.my |

### Why No Database?

Resume data lives on [JSONBin.io](https://jsonbin.io) — a cloud JSON storage API. The public site fetches data at runtime (no build needed for data changes). The admin panel writes directly to the bin via the JSONBin API. Zero infrastructure cost, no resume data in the repo.

### API & Service Costs

| Service | Cost | Limits |
|---------|------|--------|
| **JSONBin.io** | Free | 10,000 requests/month |
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
│   ├── useResume.ts          # Fetch resume from JSONBin for public pages
│   └── useGitHubPat.ts       # sessionStorage key management
├── pages/
│   ├── Landing.tsx           # Home page
│   ├── Resume.tsx            # ATS resume view
│   ├── Login.tsx             # Google sign-in
│   └── Admin.tsx             # Tabbed admin panel
├── services/
│   └── github.ts             # JSONBin API (read + update)
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
VITE_JSONBIN_BIN_ID=          # JSONBin bin ID (from jsonbin.io dashboard)
```

### JSONBin Master Key

For admin panel writes:
1. Go to [jsonbin.io/app/settings/api-keys](https://jsonbin.io/app/settings/api-keys)
2. Copy your **Master Key** (starts with `$2a$10$...`)
3. The key is entered per-session in the admin panel (stored in `sessionStorage` only)

## Development

```bash
npm run dev          # Start dev server
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint
```

## Deployment

Automated via GitHub Actions — push to `main` triggers build and deploy to GitHub Pages.

Custom domain setup: see `docs/github-pages-custom-domain-setup.html`.
