# The ATOM Handbook

> **ATOM** — _Everything that makes your day work._
> Notes · Tasks · Time tracking — one personal workspace.

This is the complete documentation book for ATOM. It is organized like a
book: a **[title page](./title.md)**, a **[table of contents](./table-of-contents.md)**,
and **12 chapters**, each a folder of topical pages.

## How to read this book

| If you are…                        | Start with                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Using ATOM for the first time      | [Ch. 1 — Overview](./overview/README.md), then [Ch. 3 — Quick start](./quick-start/README.md)           |
| Working on the code                | [Ch. 2 — Architecture](./architecture/README.md) onward                                                 |
| Integrating (n8n, Discord, mobile) | [Ch. 6 — API reference](./api/README.md), [Ch. 8 — Automation](./automation/README.md)                  |
| Deploying or operating             | [Ch. 9 — Deployment](./deployment/README.md)                                                            |
| Auditing standards & security      | [Ch. 4 — Auth & security](./auth-security/README.md), [Ch. 11 — Standards audit](./standards/README.md) |
| Contributing to ATOM               | [Ch. 12 — Rules & standards](./rules/README.md)                                                         |

## One-paragraph summary

ATOM is an npm-workspaces monorepo. `apps/web` is a Next.js 16.4 App Router
application (Turbopack, Cache Components, Partial Prerendering) whose pages are
protected by Neon Auth sessions and whose `/api/*` routes are protected by a
bearer token. All database access flows through a server-only Data Access Layer
(`apps/web/lib/dal.ts`) that scopes every query to an explicit user id.
Validation lives once, in Zod, in `packages/shared`, and is shared by the UI,
the API, and the Discord bot. Data lives in Neon Postgres via Prisma;
infrastructure is declared in `neon.ts` and applied with `neon deploy`. The
whole thing deploys to Google Cloud Run from a multi-stage Dockerfile.

## Book structure

```text
book/
├── README.md                ← you are here (preface)
├── title.md                 ← title page
├── table-of-contents.md     ← full table of contents
├── overview/                ← Ch. 1  atom-info, principles, mvp-scope, roadmap
├── architecture/            ← Ch. 2  layout, request-flows, patterns, key-files
├── quick-start/             ← Ch. 3  setup, environment, dev-loop, neon-workflow
├── auth-security/           ← Ch. 4  neon-auth, data-access-layer, api-token, …
├── features/                ← Ch. 5  notes, tasks, time-tracking, shared-ui
├── api/                     ← Ch. 6  overview, health, notes, tasks, time
├── data/                    ← Ch. 7  schema, connections, migrations, seed, storage
├── automation/              ← Ch. 8  n8n, discord
├── deployment/              ← Ch. 9  build, cloud-run, environment, go-live
├── testing/                 ← Ch. 10 unit, e2e, manual-verification, adding-tests
├── rules/                   ← Ch. 12 code, git, testing, security, docs, checklist
└── standards/               ← Ch. 11 sources, curriculum, production-checklist, …
```

Every chapter folder has a `README.md` that opens the chapter, and every
page carries a breadcrumb back to the [table of contents](./table-of-contents.md).

**Product spec** (the original product thinking):
[`Project Atom.md`](../Project%20Atom.md) at the repo root.
