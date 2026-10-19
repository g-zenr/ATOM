# Core patterns

> Chapter 2 — Architecture · [Contents](../table-of-contents.md)

## 1. Server-only Data Access Layer (`apps/web/lib/dal.ts`)

Every database read/write in ATOM goes through `lib/dal.ts`, which imports `"server-only"` (a build error if a Client Component ever touches it). **No query is unscoped** — each function takes an explicit `userId`. Two entry points resolve that user:

- `requireUser()` — browser context: the Neon Auth session user (pages + Server Actions)
- `getOwnerUser()` — token context: the workspace owner (API routes called by n8n/bot)

## 2. Two auth contexts, one DAL

Pages and actions authenticate with **Neon Auth sessions**; API routes authenticate with a **bearer token** (`ATOM_API_TOKEN`). Both converge on the same DAL functions, so data rules (ownership, validation) exist exactly once.

## 3. Cache Components (Next.js 16)

`cacheComponents: true` is on. DB access is deferred with `await connection()` and wrapped in `<Suspense>` boundaries with `loading.tsx` skeletons — pages prerender their static shell and stream dynamic content. `export const dynamic` is **removed** in this mode; don't reintroduce it.

## 4. Validation lives once

Zod schemas in `packages/shared` are shared by Server Actions, API route handlers, and (via the API) the Discord bot. `parseFormData()` normalizes `FormData` (empty string → `undefined`) before parsing.

## 5. Lazy auth instance

`lib/auth/server.ts` exports `getAuth()` — a lazy singleton. Constructing the Neon Auth client reads env vars that only exist at runtime, so the module stays import-safe during `next build` page-data collection.

## 6. Explicit proxy matcher

`proxy.ts` protects exactly four page prefixes (`/dashboard`, `/notes`, `/tasks`, `/time`) plus all of `/api`. The landing page and `/auth/*` stay public by design.
