# Neon Auth (browser sessions)

> Chapter 4 — Auth & security · [Contents](../table-of-contents.md)

ATOM has **two independent gates**, one for browsers and one for machines. Both feed the same Data Access Layer.

```text
Browsers  ──► Neon Auth session cookie ──► pages + Server Actions
n8n/bot   ──► ATOM_API_TOKEN bearer      ──► /api/* routes
```

`neon.ts` declares `auth: true`, so the linked Neon branch runs Managed Auth as a service. The app wires it with `@neondatabase/auth`:

| Piece                                      | File                                       |
| ------------------------------------------ | ------------------------------------------ |
| Server instance (lazy `getAuth()`)         | `apps/web/lib/auth/server.ts`              |
| Browser client (`createAuthClient()`)      | `apps/web/lib/auth/client.ts`              |
| Catch-all handler (`auth.handler()`)       | `apps/web/app/api/auth/[...path]/route.ts` |
| Sign-in page (email + password)            | `apps/web/app/auth/sign-in/page.tsx`       |
| Sign-up page                               | `apps/web/app/auth/sign-up/page.tsx`       |
| Session gate (redirect to `/auth/sign-in`) | `apps/web/proxy.ts`                        |

## Flow

Sign up at `/auth/sign-up` → Managed Auth stores the identity in its own `neon_auth` schema and sends a verification code on its shared SMTP provider (development) → sign in at `/auth/sign-in` → session cookie issued → protected pages work.

## Identity linking

The app's `User` table links to Neon Auth via `User.authUserId` (unique, nullable). `requireUser()` resolves in three steps:

1. Existing row with this `authUserId` → return it.
2. Existing row with the same **email** (e.g. the seeded demo user) → adopt it (write the `authUserId` onto it).
3. Otherwise → create a new `User` row.

**Sign out:** the "Sign out" button in the nav calls `authClient.signOut()` and returns to `/auth/sign-in`.
