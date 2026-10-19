# Seed data

> Chapter 7 — Data · [Contents](../table-of-contents.md)

`npm run db:seed` (`packages/db/prisma/seed.ts`) creates user `me@atom.local` with:

- 1 welcome note (tagged `getting-started`)
- 3 sample tasks (one done)
- 1 sample 9→5 time entry

The seed user's data can be **adopted** by signing up with the same email (`me@atom.local`) — `requireUser()` links by email when no `authUserId` match exists. Sign up with any other email to start with a clean workspace.
