# Runtime environment

> Chapter 9 — Deployment · [Contents](../table-of-contents.md)

The Cloud Run service needs every variable the app reads — the same set as [local development](../quick-start/environment.md):

- `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED`
- `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET`
- `ATOM_API_TOKEN` — **critical**: if unset, the API gate is off
- `DISCORD_TOKEN` — only if the bot runs somewhere with this env

Manage them with:

```bash
gcloud run services update atom-web --update-env-vars "KEY=value"
```
