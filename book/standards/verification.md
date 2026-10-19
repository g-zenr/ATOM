# Verification

> Chapter 11 — Standards audit · [Contents](../table-of-contents.md)

## Local verification recipe

```powershell
npm run lint            # ESLint incl. jsx-a11y
npm run typecheck       # tsc --noEmit
npm test                # Vitest (shared package)
npm run format:check    # Prettier
npm run build           # next build (typecheck + lint + prerender)
npm run test:e2e        # Playwright (starts its own dev server)
ANALYZE=true npm run build   # bundle report
```

All commands pass as of this audit.

## Verified auth flow (manual)

1. `GET /dashboard` unauthenticated → **307** → `/auth/sign-in`
2. `POST /api/auth/sign-up/email` → user created in Managed Auth
3. `POST /api/auth/sign-in/email` → session cookie issued
4. `GET /dashboard` with cookie → **200**
5. `GET /api/notes` without token → **401**; with token → **200**
6. `GET /api/health` → `{"ok":true,"db":"up"}`
