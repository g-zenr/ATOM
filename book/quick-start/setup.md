# Setup

> Chapter 3 — Quick start · [Contents](../table-of-contents.md)

## Prerequisites

- **Node.js ≥ 20** (built and tested with Node 22)
- A **Neon account** + CLI: `npm i -g neon@latest && neon login`
- The project linked: `neon link` → project `wandering-queen-99992939`, branch `production`

## First-time setup

```bash
npm install          # installs all workspaces
npm run db:generate  # generate the Prisma client
npm run db:push      # create the tables in the linked Neon branch
npm run db:seed      # sample note, tasks, time entry (optional)
npm run dev          # http://localhost:3000
```

Then open http://localhost:3000, go to **Sign up**, and create your account. On first sign-in ATOM creates your workspace user row automatically.

> **Why `db:push` and not `migrate dev`?** `prisma migrate dev` needs a shadow database, which Neon doesn't provide reliably on the free plan. Once the schema stabilizes, switch to migration files on a dev branch (`neon checkout dev-my-feature --create`, then `npm run db:migrate -- --name init`).
