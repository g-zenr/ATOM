# syntax=docker/dockerfile:1

# ---- deps: install all workspaces ------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY . .
# prisma generate runs automatically via @prisma/client's postinstall
RUN npm ci

# ---- builder: generate Prisma client + build Next.js ------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app ./
RUN npm run build

# ---- runner -----------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone server + static assets
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Prisma query engine is externalized (serverExternalPackages) — trace it in
# explicitly so the runtime can load it.
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma/client ./node_modules/@prisma/client

USER nextjs
EXPOSE 8080

CMD ["node", "apps/web/server.js"]
