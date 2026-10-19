# API overview

> Chapter 6 — API reference · [Contents](../table-of-contents.md)

Base URL: `https://<service-url>/` (Cloud Run) or `http://localhost:3000` (dev).

**Auth:** every route except `/api/health` requires

```
Authorization: Bearer <ATOM_API_TOKEN>
```

(`x-api-key` also accepted.) Without the token: `401 Unauthorized`. Over the rate limit: `429 Too Many Requests` (120 req/min per IP).

**Errors** are JSON: `{ "error": "..." }`. Validation errors: `{ "error": { …Zod flatten… } }` with status `400`.

## Status codes

| Code | Meaning                                                |
| ---- | ------------------------------------------------------ |
| 200  | Success                                                |
| 201  | Created                                                |
| 400  | Validation failed (Zod)                                |
| 401  | Missing/invalid token                                  |
| 404  | Resource not found (e.g. no open session with that id) |
| 409  | Conflict (session already open)                        |
| 429  | Rate limited                                           |

> **Note:** the API currently supports list + create (and clock-out). Editing/deleting via API is a natural next step — the DAL functions already exist for the UI's needs.
