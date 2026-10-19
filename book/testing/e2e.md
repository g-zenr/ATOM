# E2E tests (Playwright)

> Chapter 10 — Testing · [Contents](../table-of-contents.md)

```bash
npm run test:e2e  # 6 tests; boots its own dev server
```

`apps/web/e2e/smoke.spec.ts` verifies the anonymous surface — deliberately **no signed-in flows**, so the suite stays deterministic:

| Test             | Asserts                                                           |
| ---------------- | ----------------------------------------------------------------- |
| Landing page     | brand renders                                                     |
| Protected routes | `/dashboard`, `/notes`, `/tasks`, `/time` all redirect to sign-in |
| Sign-in page     | accessible form (labels, button)                                  |
| Health endpoint  | 200 + `db: "up"` without a token                                  |
| API gate         | 401 on `/api/notes`, `/api/tasks`, `/api/time` without a token    |
| Unknown routes   | custom 404 page                                                   |

Config: `apps/web/playwright.config.ts` (chromium, headless, `webServer` auto-starts `npm run dev`). Browsers install with `npx playwright install chromium`.
