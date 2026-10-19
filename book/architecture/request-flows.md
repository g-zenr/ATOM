# Request flows

> Chapter 2 — Architecture · [Contents](../table-of-contents.md)

## Browser (Server Components + Server Actions)

```text
Browser ──► proxy.ts ──► Neon Auth session check ──► page (Server Component)
                                                        │
                                            Server Action (Zod-validated)
                                                        │
                                            lib/dal.ts (server-only, userId-scoped)
                                                        │
                                            Prisma ──► Neon Postgres
```

## Machine clients (n8n, Discord bot, future mobile)

```text
n8n / bot ──► proxy.ts ──► bearer token check + rate limit ──► /api/* route handler
                                                                    │
                                                        lib/dal.ts (owner user)
                                                                    │
                                                        Prisma ──► Neon Postgres
```

## Sign-in / sign-up

```text
Browser ──► /api/auth/* ──► auth.handler() ──► Neon Auth service (managed by Neon)
                     ◄── session cookie ◄──┘
```
