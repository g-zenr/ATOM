# Key files

> Chapter 2 — Architecture · [Contents](../table-of-contents.md)

| File                               | Responsibility                                             |
| ---------------------------------- | ---------------------------------------------------------- |
| `apps/web/proxy.ts`                | Session gate (pages), bearer-token gate + rate limit (API) |
| `apps/web/lib/dal.ts`              | All database access, user-scoped                           |
| `apps/web/lib/auth/server.ts`      | Lazy Neon Auth server instance                             |
| `apps/web/lib/env.ts`              | Zod-validated server env, cached                           |
| `apps/web/app/actions/*.ts`        | Server Actions (Zod → DAL → `refresh()`)                   |
| `apps/web/app/api/*/route.ts`      | REST endpoints (Zod → DAL)                                 |
| `packages/shared/src/index.ts`     | Zod schemas + duration helpers                             |
| `packages/db/prisma/schema.prisma` | Database schema                                            |
| `neon.ts`                          | Neon infra (auth, preview buckets)                         |
