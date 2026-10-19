# Code standards

> Chapter 12 — Rules & standards · [Contents](../table-of-contents.md)

## TypeScript

- **Strict mode, everywhere.** `tsc --noEmit` must pass before anything is considered done.
- **No `any`.** Derive types from Zod schemas with `z.infer` — the schema is the type's source of truth.
- **Validate at the boundary.** Every external input (form, request body, query param) is parsed with a Zod schema from `packages/shared` before it touches anything else. No ad-hoc validation.

## App Router (Next.js 16.4)

- **Server Components by default.** Client Components only where interactivity requires them, marked `"use client"`.
- **`export const dynamic` is banned** — it's removed under Cache Components. Defer DB access with `await connection()` and wrap in `<Suspense>`; add a `loading.tsx` for new data routes.
- **Server Actions** live in `app/actions/*.ts`, return `void` or a typed `ActionResult`, and do their own auth check (`requireUser()`) — never rely on the proxy alone.
- **File conventions:** `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx` in their route folders; kebab-case for everything else.

## Data access

- **All database access goes through `apps/web/lib/dal.ts`.** Direct Prisma calls from pages, actions, or routes are not allowed.
- **Every DAL function takes an explicit `userId`.** No unscoped queries — ever.
- **Mutations scope by owner:** `updateMany`/`deleteMany` with `{ id, userId }`, not `update`/`delete` with `{ id }`.

## Style

- **Prettier is the law.** `npm run format` before committing; `format:check` in review. No hand-rolled formatting debates.
- **Imports:** `@/` maps into `apps/web`, `@atom/*` maps to workspace packages.
- **Naming:** `camelCase` functions/variables, `PascalCase` components/types, `SCREAMING_SNAKE_CASE` constants.
