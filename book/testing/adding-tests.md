# Adding tests & CI

> Chapter 10 — Testing · [Contents](../table-of-contents.md)

## Where new tests go

- **Shared logic** → `packages/shared/src/*.test.ts` (Vitest picks up `*.test.ts`).
- **New E2E** → `apps/web/e2e/*.spec.ts`. For authenticated tests, seed a test account and sign in via `POST /api/auth/sign-in/email` with the `request` context — but note the suite currently avoids it to stay hermetic.

## CI note

There is no CI yet. A minimal pipeline:

```bash
npm run lint && npm run typecheck && npm test && npm run test:e2e && npm run build
```
