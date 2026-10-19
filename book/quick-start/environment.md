# Environment variables

> Chapter 3 — Quick start · [Contents](../table-of-contents.md)

The root `.env` is managed by the Neon CLI (`neon env pull`). Copy `.env.example` if you need to set values by hand:

| Variable                  | Required | Purpose                                                                                                                    |
| ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`            | ✅       | Pooled connection (PgBouncer) — app runtime                                                                                |
| `DATABASE_URL_UNPOOLED`   | ✅       | Direct connection — migrations only                                                                                        |
| `NEON_AUTH_BASE_URL`      | ✅       | Pulled by the Neon CLI (Managed Auth)                                                                                      |
| `NEON_AUTH_COOKIE_SECRET` | ✅       | Generate: `openssl rand -base64 32`                                                                                        |
| `ATOM_API_TOKEN`          | optional | Bearer token for `/api/*` (n8n, bot). Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `DISCORD_TOKEN`           | optional | Discord bot                                                                                                                |
| `ATOM_API_URL`            | optional | Bot's API target (default `http://localhost:3000`)                                                                         |

> Never commit `.env`. It is git-ignored; `.env.example` shows the shape.
