# Cloud Run

> Chapter 9 — Deployment · [Contents](../table-of-contents.md)

```bash
gcloud run deploy atom-web \
  --source . \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars "ATOM_API_TOKEN=...,DATABASE_URL=...,DATABASE_URL_UNPOOLED=...,NEON_AUTH_BASE_URL=...,NEON_AUTH_COOKIE_SECRET=..."
```

Set the **same env vars the root `.env` holds locally** (see [environment variables](../quick-start/environment.md)). The runtime loads them from the container environment — there is no `.env` file in the image.

**Why this is nearly free:** Cloud Run scales to zero (no cost at idle) and Neon's free tier covers the database for a personal app.

## Neon side

```bash
neon deploy    # apply neon.ts (auth, preview buckets) to the linked branch
neon status    # show live branch config
```
