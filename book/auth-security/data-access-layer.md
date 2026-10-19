# Data Access Layer

> Chapter 4 — Auth & security · [Contents](../table-of-contents.md)

`apps/web/lib/dal.ts` — the only path to the database.

- Imports `"server-only"` — any Client Component import fails the build.
- Every function takes an explicit `userId`; there is no unscoped query anywhere.
- Mutations use `updateMany`/`deleteMany` with `{ id, userId }` so a wrong id can never touch another user's row.
- Pages and Server Actions both call `requireUser()` first — the proxy is a convenience redirect, never the security check.

See also [pattern 1](../architecture/patterns.md) in the architecture chapter.
