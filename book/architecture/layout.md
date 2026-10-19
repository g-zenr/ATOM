# Monorepo layout

> Chapter 2 — Architecture · [Contents](../table-of-contents.md)

```text
Atom/
├── apps/
│   └── web/                  Next.js 16.4 app — UI, Server Actions, REST API
│       ├── app/              App Router: pages, actions, API routes, boundaries
│       ├── lib/              auth/, dal.ts (Data Access Layer), env.ts, cn.ts
│       ├── store/            Zustand UI store (theme, quick-capture)
│       ├── proxy.ts          Next.js 16 "middleware" (renamed) — auth + token gate + rate limit
│       ├── instrumentation.ts + register.node.ts / register.edge.ts  load root .env at boot
│       ├── next.config.ts    security headers, bundle analyzer, standalone output
│       ├── e2e/              Playwright smoke suite
│       └── Dockerfile        multi-stage Cloud Run build
├── packages/
│   ├── db/                   Prisma schema, client singleton, seed
│   ├── shared/               Zod schemas, form parsing, duration helpers, Vitest tests
│   └── discord/              discord.js bot skeleton (npm run bot)
├── neon.ts                   Neon infrastructure-as-code (auth, preview buckets)
├── .env                      Runtime secrets — written by the Neon CLI, git-ignored
└── book/                     The documentation book (title page, TOC, chapters)
```
