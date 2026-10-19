# Neon workflow & verification

> Chapter 3 — Quick start · [Contents](../table-of-contents.md)

## Branch-first workflow (Neon)

```bash
neon status                            # live branch config
neon checkout dev-my-feature --create  # new branch + env pulled automatically
neon deploy                            # apply neon.ts to the current branch
```

Test schema changes on a branch, review with `neon diff`, then apply to production.

## Verification checklist

After setup, all of these should pass:

- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm test` — 12/12
- [ ] `npm run test:e2e` — 6/6
- [ ] `npm run build` — succeeds
- [ ] http://localhost:3000 — landing page renders
- [ ] http://localhost:3000/dashboard — redirects to sign-in (unauthenticated)
- [ ] Sign up → dashboard shows your (empty) workspace
- [ ] `curl localhost:3000/api/health` → `{"ok":true,"db":"up"}`
