# Curriculum compliance

> Chapter 11 — Standards audit · [Contents](../table-of-contents.md)

The Next.js Foundations course builds the canonical dashboard app. Each chapter maps to a standard ATOM was checked against.

| #   | Chapter standard                                 | ATOM status                                                                                                                                 |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Project scaffold + structure (`create-next-app`) | ✅ Monorepo: `apps/web` + `packages/{db,shared,discord}`                                                                                    |
| 2   | Styling                                          | ✅ Tailwind CSS v4 (`@tailwindcss/turbopack`), design tokens via `@theme inline`                                                            |
| 3   | Fonts & Images                                   | ✅ `next/font` (Geist + Geist Mono, self-hosted). Images: N/A — no UI images; `public/` cleaned of boilerplate                              |
| 4   | Layouts & Pages                                  | ✅ Root layout with shared nav; route pages under `app/`                                                                                    |
| 5   | Navigation                                       | ✅ `next/link` with prefetching for all routes                                                                                              |
| 6   | Database setup + seed                            | ✅ Prisma + Neon Postgres, `prisma/seed.ts`, `npm run db:seed`                                                                              |
| 7   | Data fetching                                    | ✅ Server Components query through the DAL only; Route Handlers are never called from Server Components                                     |
| 8   | Static & dynamic rendering                       | ✅ PPR default; DB routes deferred with `connection()` + `<Suspense>` (`loading.tsx` per route)                                             |
| 9   | Streaming                                        | ✅ `loading.tsx` skeletons on all 4 data routes + per-query `<Suspense key>` boundaries                                                     |
| 10  | Search & pagination                              | ✅ `?query=` + `?page=` on notes/tasks (GET forms, URL state, `contains … mode: "insensitive"`), status filter tabs, 20-per-page pagination |
| 11  | Mutating data                                    | ✅ Server Actions (`app/actions/notes.ts`, `app/actions/tasks.ts`), `refresh()` after mutations, Zod validation shared with the API         |
| 12  | Error handling                                   | ✅ `error.tsx`, `global-error.tsx`, `not-found.tsx`, `global-not-found.tsx`                                                                 |
| 13  | Accessibility                                    | ✅ Labels on every input, `role="alert"` errors, `aria-label` navigation, `jsx-a11y` lint rules passing                                     |
| 14  | Authentication                                   | ✅ **Neon Auth (Managed Better Auth)** — sign-in/sign-up pages, session-protected routes, `/api/auth/*` handler                             |
| 15  | Metadata                                         | ✅ Title/description in root layout; `app/icon.svg`. OG images: N/A (personal app)                                                          |
| 16  | Deployment                                       | ✅ Cloud Run via standalone `Dockerfile`; `neon deploy` for branch infra                                                                    |
