# Hardening & pre-launch

> Chapter 4 — Auth & security · [Contents](../table-of-contents.md)

## Other hardening

- **Security headers** (production only, in `next.config.ts`): CSP (`default-src 'self'`, `script-src 'self' 'unsafe-inline'` — see note), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `poweredByHeader: false`.
- **CSP note:** Next.js injects inline bootstrap scripts, so `script-src` keeps `'unsafe-inline'`. Nonce-based CSP is the future hardening step (see [chapter 11](../standards/README.md)).
- **No public secrets:** nothing is `NEXT_PUBLIC_`; all env is server-side and Zod-validated at startup (`lib/env.ts`).
- **Dev origins:** `allowedDevOrigins: ["127.0.0.1"]` so Playwright can probe the dev server.

## Before public launch

1. Custom SMTP for Managed Auth (verification emails currently go through Neon's shared provider) — see Neon's production checklist.
2. Rotate `NEON_AUTH_COOKIE_SECRET` and `ATOM_API_TOKEN` to fresh values.
3. Keep `.env` out of any repo/backup that leaves the machine.
