# Review checklist

> Chapter 12 — Rules & standards · [Contents](../table-of-contents.md)

Run this before calling any change complete:

## Correctness

- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm test` — passing
- [ ] `npm run test:e2e` — passing
- [ ] `npm run build` — succeeds
- [ ] `npm run format:check` — clean

## Standards

- [ ] Validation lives in a Zod schema in `packages/shared` (not inline)
- [ ] DB access goes through the DAL, scoped to a `userId`
- [ ] Server Action verifies the session itself
- [ ] No `export const dynamic`; new data routes use `connection()` + `<Suspense>` + `loading.tsx`
- [ ] No `any` types; inputs parsed at the boundary

## Operations

- [ ] `.env.example` updated for any new variable
- [ ] No secrets in the diff
- [ ] Book updated (feature page, API page, or standards change log)
- [ ] Destructive steps (if any) were approved by a human
