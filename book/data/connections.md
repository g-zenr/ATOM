# Connections

> Chapter 7 — Data · [Contents](../table-of-contents.md)

| Variable                | Used for        | Why                                                                             |
| ----------------------- | --------------- | ------------------------------------------------------------------------------- |
| `DATABASE_URL`          | App runtime     | Pooled via PgBouncer (`pgbouncer=true`) — survives serverless connection limits |
| `DATABASE_URL_UNPOOLED` | Migrations only | Migrations need a direct connection                                             |

Both are pulled into the root `.env` by the Neon CLI. Prisma reads them from `schema.prisma` (`url` / `directUrl`).
