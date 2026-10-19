# ATOM — Personal Workspace

> Everything that makes your day work. Notes, tasks, and time in one workspace.

Monorepo: **Next.js** (UI + API) · **Prisma + Neon Postgres** · **TypeScript** everywhere.
Product spec: [`Project Atom.md`](./Project%20Atom.md).
**[📖 The ATOM Handbook](./book/README.md)** — the full documentation book: title page, table of contents, and 11 chapters covering overview, architecture, quick start, auth & security, features, API reference, data, automation, deployment, testing.

Standards audit (Next.js 16.4 docs + Foundations course): [`book/standards/README.md`](./book/standards/README.md).

## Layout

```text
apps/
  web/                  Next.js 16 app (UI + REST API + Discord/n8n surface)
packages/
  db/                   Prisma schema, client singleton, seed
  shared/               Zod schemas + shared types (app, API, bot)
  discord/              discord.js bot skeleton (npm run bot)
neon.ts                 Neon infrastructure-as-code (auth + preview buckets)
.env                    Single source of truth (written by the Neon CLI)
.opencode/skills/       Neon agent skills (installed for this project)
```

## Prerequisites

- Node.js ≥ 20 (built with Node 22)
- A Neon account + CLI (`npm i -g neon@latest && neon login`)

## First-time setup

```bash
npm install                    # installs all workspaces
npm run db:generate            # generate the Prisma client
npm run db:push                # create the tables in the linked Neon branch
npm run db:seed                # sample notes/tasks/time entry
npm run dev                    # http://localhost:3000
```

> `db:push` creates the initial schema directly. `prisma migrate dev` needs a
> shadow database, which Neon doesn't provide reliably on the free plan — once
> the schema is stable, switch to migration files on a dev branch
> (`neon checkout dev-... --create`, then `npm run db:migrate -- --name ...`).

````

> The root `.env` is managed by the Neon CLI (`neon link`, `neon env pull`,
> `neon deploy`). It holds the pooled `DATABASE_URL` (app traffic) and
> `DATABASE_URL_UNPOOLED` (migrations). Never commit it; `.env.example` shows the shape.

## Branch-first workflow (Neon)

```bash
neon status                                    # live branch config
neon checkout dev-my-feature --create          # new branch + env pulled automatically
neon deploy                                    # apply neon.ts to the current branch
````

Test schema changes on a branch, then `neon diff` before applying to production.

## API (for n8n, mobile, and the Discord bot)

All `/api/*` routes require a bearer token, checked by `apps/web/proxy.ts`
(Next.js 16 renamed `middleware` to `proxy`). `/api/health` stays open.
Browser pages instead use Neon Auth sessions — see **Auth** below.

```bash
curl localhost:3000/api/notes \
  -H "Authorization: Bearer $ATOM_API_TOKEN"

curl -X POST localhost:3000/api/notes \
  -H "Authorization: Bearer $ATOM_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"From n8n","content":"..."}'
```

| Route                 | Methods   | Purpose                                   |
| --------------------- | --------- | ----------------------------------------- |
| `/api/health`         | GET       | Liveness + DB check (open)                |
| `/api/notes`          | GET, POST | List / create notes                       |
| `/api/tasks`          | GET, POST | List / create tasks                       |
| `/api/time`           | GET, POST | Entries + open session / clock in         |
| `/api/time/clock-out` | POST      | `{ "id": "..." }` — close an open session |

In n8n: HTTP Request node → the routes above, header
`Authorization: Bearer <ATOM_API_TOKEN>`.

## Deploy (Cloud Run)

```bash
# from the repo root — DATABASE_URL is injected from your Neon branch at runtime
gcloud run deploy atom-web \
  --source . \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars "ATOM_API_TOKEN=...,DATABASE_URL=..."
```

`apps/web/Dockerfile` builds the standalone output for the Cloud Run Node runtime.
Set the same env vars in the Cloud Run service that `.env` holds locally.

## Auth (Neon Auth — Managed Better Auth)

`neon.ts` declares `auth: true`, so the production branch has Managed Auth
provisioned. The app wires it with `@neondatabase/auth`:

- `apps/web/lib/auth/server.ts` — lazy `getAuth()` (import-safe for builds)
- `apps/web/app/api/auth/[...path]/route.ts` — the auth handler (all verbs)
- `/auth/sign-in`, `/auth/sign-up` — email + password pages
- `proxy.ts` — redirects unauthenticated pages to `/auth/sign-in`
- `lib/dal.ts` — `requireUser()` links the Neon Auth identity to the app `User`

Needed env (root `.env`, git-ignored): `NEON_AUTH_BASE_URL` (pulled by the
Neon CLI) and `NEON_AUTH_COOKIE_SECRET` (generate: `openssl rand -base64 32`).

Sign up at http://localhost:3000/auth/sign-up — Managed Auth sends a
verification code on its shared SMTP during development.

## Notes & next steps

- **Stack standards**: Zod v4 for all validation (`@atom/shared` — shared by UI,
  API routes, and the bot), Zustand v5 for client UI state (theme + quick
  capture, persisted), `clsx` + `tailwind-merge` via `cn()`, typed env
  (`apps/web/lib/env.ts`, validated at startup), Vitest + Playwright for tests,
  Prettier + Tailwind plugin for formatting, server-only Data Access Layer.
- **Scripts**: `npm run dev` · `build` · `start` · `lint` · `typecheck` ·
  `test` · `test:e2e` · `format` / `format:check` · `db:push` · `db:seed` ·
  `bot`.
- **Next.js 16.4**: `middleware` is now `proxy.ts`; Cache Components are on, so
  DB access goes behind `connection()` + `<Suspense>` (`loading.tsx`). Don't
  reintroduce `export const dynamic` — it's removed with Cache Components.
- **Object Storage**: `uploads` bucket is declared for preview branches in
  `neon.ts`; AWS S3 env vars are already pulled into `.env`.
- **Discord bot**: `npm run bot` — add `DISCORD_TOKEN` to `.env`.
