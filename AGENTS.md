# FRONTEND KNOWLEDGE BASE

**Generated:** 2026-01-29
**Framework:** Next.js 16 (App Router)
**UI:** React 19 + Tailwind CSS 4

## OVERVIEW
Frontend application for Jitu. Uses Next.js 16 App Router with a feature-sliced folder structure in `modules/`.

## STRUCTURE
```
jitu-frontend/
├── app/              # Routes & Layouts
│   ├── (auth)/       # Auth routes group
│   ├── (main)/       # Main app routes
│   └── (admin)/      # Admin dashboard routes
├── modules/          # Feature implementation (UI + Logic)
├── lib/
│   └── api/          # Typed API clients
└── components/       # Shared UI (shadcn/ui etc)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| **Pages/Routes** | `app/` | Routing definition only |
| **Feature Components** | `modules/{Module}` | Actual page content |
| **API Calls** | `lib/api/{Feature}Api.ts` | Backend integration |
| **Global UI** | `components/ui` | Reusable primitives |

## CONVENTIONS
- **Feature Modules**: Logic lives in `modules/`, not `app/`. `app/` just imports modules.
- **API Pattern**: Use classes in `lib/api` to fetch data. Do not use `fetch` directly in components.
- **Styling**: Tailwind CSS v4.
- **State**: React 19 hooks.

## ANTI-PATTERNS
- **Logic in Pages**: `app/**/page.tsx` should remain thin.
- **Direct Fetch**: Always use `lib/api` wrappers.
- **Hardcoded URLs**: Use environment variables.

## COMMANDS
```bash
npm run dev      # Runs on port 5173
npm run build    # Production build
npm run lint     # Lint check
```
