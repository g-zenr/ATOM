# Testing rules

> Chapter 12 — Rules & standards · [Contents](../table-of-contents.md)

## What must be tested

- **Shared logic** (`packages/shared`) — schemas, parsing, helpers — always has Vitest tests. It runs everywhere, so it's tested everywhere-agnostically.
- **New anonymous API/page behavior** — extend the Playwright smoke suite (`apps/web/e2e/`).
- **Signed-in flows** — verify manually and record the recipe in [standards/verification.md](../standards/verification.md), or seed a hermetic test account when CI lands.

## House style

- **The E2E suite stays hermetic:** no real Neon Auth accounts, no shared-state dependencies. It must pass on a fresh clone.
- **Tests are code:** same lint/format/type standards as the app.

## The gate

Nothing is "done" until all of these pass:

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```
