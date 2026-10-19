# Object storage

> Chapter 7 — Data · [Contents](../table-of-contents.md)

`neon.ts` declares a private `uploads` bucket for **preview branches** (`preview.buckets.uploads`). AWS S3-compatible env vars are pulled into `.env` by the Neon CLI. No code uses it yet — it's the landing zone for the planned attachments feature.

> Open offer from the build: lifting `preview.buckets` → `buckets` in `neon.ts` would provision `uploads` on production too.
