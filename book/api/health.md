# Health

> Chapter 6 — API reference · [Contents](../table-of-contents.md)

## `GET /api/health`

Open (no token). Liveness + database check.

```json
{ "ok": true, "db": "up" }
```

Use it as the Cloud Run liveness/readiness probe and in uptime monitoring.
