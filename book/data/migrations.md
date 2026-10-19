# Schema changes

> Chapter 7 — Data · [Contents](../table-of-contents.md)

```bash
npm run db:push        # push schema directly (current workflow — no shadow DB needed)
npm run db:migrate -- --name <name>   # migration files (needs a dev branch + unpooled URL)
```

> `prisma migrate dev` hangs on Neon's free plan (no shadow database). `db:push` is the supported path today; switch to migration files on a `neon checkout dev-… --create` branch when the schema stabilizes.
