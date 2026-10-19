# Production checklist audit

> Chapter 11 — Standards audit · [Contents](../table-of-contents.md)

## Compliant with no action needed

- **Automatic optimizations** — Server Components, route code-splitting, `<Link>` prefetching, PPR prerendering, request-scoped caching (all default with `cacheComponents: true`).
- **Route Handlers vs Server Components** — pages never call `/api/*`; only external clients (n8n, Discord bot, future mobile) do.
- **Environment variables** — secrets only in root `.env` (git-ignored), injected at runtime; nothing `NEXT_PUBLIC_`.
- **TypeScript** — strict, `tsc --noEmit` clean, Next TS plugin in `tsconfig.json`.
- **Lint** — `eslint` with `core-web-vitals` (includes `eslint-plugin-jsx-a11y`), passing.
- **Testing** — Vitest unit tests (`@atom/shared`) + Playwright E2E smoke suite (`apps/web/e2e/smoke.spec.ts`).
- **Bundle analysis** — `@next/bundle-analyzer` wired behind `ANALYZE=true npm run build`.

## Implemented across the two audit passes

| Standard                                | Where it lives                                                                                                                    |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Custom error pages (route + global)     | `app/error.tsx`, `app/global-error.tsx`                                                                                           |
| Custom 404 (route + global)             | `app/not-found.tsx`, `app/global-not-found.tsx`                                                                                   |
| Search + pagination                     | `lib/dal.ts` (`listNotes`/`listTasks` with `query`/`page`), `?query=`/`?page=` in pages, `app/components/pagination.tsx`          |
| Server-side validation                  | Zod `parseFormData` in `@atom/shared`, used by every Server Action                                                                |
| Accessible forms                        | Labels + `role="alert"`/`role="status"` across all forms                                                                          |
| Security headers                        | `next.config.ts` (production-only): CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `poweredByHeader: false` |
| Data Access Layer (data-security guide) | `apps/web/lib/dal.ts` — `server-only`, explicit `userId` on every query, no unscoped access anywhere                              |
| Authentication + route protection       | `lib/auth/server.ts` (lazy `getAuth()`), `lib/auth/client.ts`, `app/api/auth/[...path]/route.ts`, `app/auth/sign-in               | sign-up`, session check in `proxy.ts` |
| API authentication                      | Bearer-token gate in `proxy.ts` (n8n/Discord/mobile), separate from browser sessions                                              |
| Rate limiting                           | Fixed-window per-IP limiter (120 req/min) on `/api/*` in `proxy.ts`                                                               |
| Boilerplate cleanup                     | Unused CNA assets removed; `app/icon.svg`                                                                                         |

## How the pieces fit

```text
Browser ──► proxy.ts ──► Neon Auth session? ──► page ──► lib/dal.ts ──► Neon Postgres
                │                              (server-only)
                └──► /api/* ──► token + rate limit ──► dal.ts (owner user) ──► Neon Postgres
n8n / bot ─────┘
```

- `requireUser()` — session context (pages/actions): Neon Auth user → app `User` row, adopting a same-email pre-auth row when one exists.
- `getOwnerUser()` — token context (API): the workspace owner.
- Server Actions and pages both go through the DAL; the proxy never _is_ the auth check for actions (it only gates the browser's page access and the token's API access), per the data-security guide.

## Remaining, with reasons

| Standard                                | Why still open                                                                                                                                                             | When                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Nonce-based CSP                         | Next injects inline bootstrap scripts; a nonce CSP needs the `x-nonce` proxy + audit of PPR interactions. Current CSP uses `'unsafe-inline'` for `script-src` (documented) | Production hardening pass            |
| Rate-limit shared store                 | In-memory limiter is per-instance; fine for one user, not for a fleet                                                                                                      | If ATOM gets real multi-user traffic |
| SMTP for production auth emails         | Managed Auth shared SMTP covers development; custom SMTP needed for production verification links (https://neon.com/docs/auth/production-checklist.md)                     | Before public launch                 |
| OG images / sitemap / robots            | Personal workspace, not public content                                                                                                                                     | Only if ATOM gets a public page      |
| Authenticated E2E coverage              | Current suite covers anonymous boundaries; a seeded test account would make sign-in flows flaky                                                                            | When CI runs the suite               |
| Lighthouse / Core Web Vitals field data | Needs real usage or a manual incognito run                                                                                                                                 | Post-deployment pass                 |
