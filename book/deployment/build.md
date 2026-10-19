# Build

> Chapter 9 — Deployment · [Contents](../table-of-contents.md)

```bash
npm run build    # next build (typecheck + lint + prerender, Turbopack)
```

The build produces `.next/standalone` (configured in `apps/web/next.config.ts` with `outputFileTracingRoot` so the monorepo is traced correctly).

## Docker

`apps/web/Dockerfile` — three stages:

1. **deps** — `npm ci` on node:22-alpine (Prisma client generates via postinstall)
2. **builder** — `npm run build`
3. **runner** — standalone server + static assets + traced Prisma engines, non-root user (`nextjs`), port **8080**
