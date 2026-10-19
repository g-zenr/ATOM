# Security rules

> Chapter 12 — Rules & standards · [Contents](../table-of-contents.md)

1. **Secrets live in `.env` only** — never in source, never in `NEXT_PUBLIC_`, never in logs or screenshots.
2. **The DAL is the only path to the database**, and every query is scoped to an explicit `userId`.
3. **Server Actions verify the session themselves** (`requireUser()`). The proxy redirect is convenience, not authorization.
4. **`ATOM_API_TOKEN` is owner-level access** — treat it like a password; rotate immediately if exposed. If it's unset in production, the API gate is _off_ — always set it.
5. **Rate limits stay on `/api/*`.** Don't remove them to "fix" a slow integration; fix the integration.
6. **Emails, passwords, and session data** flow only through Neon Auth's managed endpoints (`/api/auth/*`) — no hand-rolled auth.
7. **Destructive operations** (deleting Neon branches/projects, dropping data) require explicit human approval — ask first, always.
