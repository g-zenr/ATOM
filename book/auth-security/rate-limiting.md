# Rate limiting

> Chapter 4 — Auth & security · [Contents](../table-of-contents.md)

In-memory fixed window on `/api/*`: **120 requests/minute per IP**, `429` + `Retry-After: 60` when exceeded. The bucket map is pruned past 10k entries.

> Caveat: the counter is per-process. On Cloud Run that means per-instance — fine for one user, move to a shared store (e.g. Neon) if traffic grows.
