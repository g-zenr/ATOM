# Chapter 10 — Testing

Two layers: unit tests for shared logic, E2E smoke tests for the shell.

- [Unit tests](./unit.md) — Vitest in `packages/shared`
- [E2E tests](./e2e.md) — Playwright smoke suite
- [Manual verification](./manual-verification.md) — the signed-in auth flow, verified by hand
- [Adding tests & CI](./adding-tests.md) — where new tests go, minimal CI pipeline
