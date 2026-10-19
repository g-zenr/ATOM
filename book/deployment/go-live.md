# Monitoring & go-live

> Chapter 9 — Deployment · [Contents](../table-of-contents.md)

## Health monitoring

`GET /api/health` → `{ "ok": true, "db": "up" }` — use it as the Cloud Run liveness/readiness probe and in uptime monitoring.

## Checklist before going live

- [ ] Fresh `NEON_AUTH_COOKIE_SECRET` (≥ 32 chars) and `ATOM_API_TOKEN` (≥ 8 chars, random)
- [ ] Custom SMTP configured for Managed Auth (verification emails)
- [ ] `ATOM_API_TOKEN` set in Cloud Run env (otherwise the API gate is **off**)
- [ ] Cloud Run service URL added to Neon Auth trusted domains if needed
- [ ] Backups/snapshots enabled on the Neon branch
