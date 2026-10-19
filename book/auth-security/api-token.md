# API token (machine access)

> Chapter 4 — Auth & security · [Contents](../table-of-contents.md)

`proxy.ts` checks `Authorization: Bearer <ATOM_API_TOKEN>` (or `x-api-key`) on every `/api/*` route except `/api/auth/*` (the auth handler) and `/api/health` (liveness probes). A missing/wrong token gets `401 Unauthorized`.

Token-context routes call `getOwnerUser()` — the workspace owner (first user). The token is therefore _owner-level access_: treat it like a password.

If `ATOM_API_TOKEN` is unset, the gate is **off** (local-development convenience).
