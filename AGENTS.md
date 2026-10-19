# ATOM — agent rules

Rules for AI agents (and humans) working on this repo. The full
version is the book: **start at `book/README.md`** — especially
[Chapter 12 — Rules & standards](./book/rules/README.md).

## Non-negotiables

1. **Read the book before changing code** — `book/architecture/`
   for how things fit, `book/rules/code.md` for conventions.
2. **This is Next.js 16.4, not the Next.js you know.** `middleware`
   is `proxy.ts`; Cache Components are on, so
   `export const dynamic` is _removed_ — defer DB access with
   `await connection()` + `<Suspense>` + `loading.tsx`. When in
   doubt, check `node_modules/next/dist/docs/`.
3. **All DB access goes through `apps/web/lib/dal.ts`** (server-only),
   every query scoped to an explicit `userId`. No direct Prisma calls
   from pages, actions, or routes.
4. **All validation is Zod in `packages/shared`** — shared by the UI,
   the API, and the bot. Validate at the boundary.
5. **Server Actions verify the session themselves** (`requireUser()`).
   The proxy is a convenience redirect, never the authorization.
6. **Two auth contexts:** browser pages = Neon Auth sessions;
   `/api/*` = `ATOM_API_TOKEN` bearer. Never mix them.

## Before declaring work done

```bash
npm run lint && npm run typecheck && npm test && npm run test:e2e && npm run build
npm run format:check
```

## Never

- Commit `.env` or any secret; nothing sensitive under `NEXT_PUBLIC_`.
- Run destructive operations (Neon branch/project deletion, data
  drops, `npm audit fix --force`) without explicit human approval.
- Reintroduce `export const dynamic`, unscoped Prisma queries, or
  inline validation.

## Keep the book honest

New feature, endpoint, env var, or script → update the matching page
in `book/` in the same change (see `book/rules/docs.md`).
