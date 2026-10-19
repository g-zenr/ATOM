# n8n

> Chapter 8 — Automation · [Contents](../table-of-contents.md)

Pattern: **HTTP Request node** → ATOM API with the bearer token.

```
HTTP Request
  URL:    https://<service>/api/notes
  Method: POST
  Headers: Authorization: Bearer <ATOM_API_TOKEN>
  Body:    {"title":"…","content":"…"}   (JSON)
```

## Recipe ideas

| Trigger                    | Action                                      |
| -------------------------- | ------------------------------------------- |
| New email / form / webhook | `POST /api/notes` — capture to Notes        |
| Calendar event starts      | `POST /api/time` — clock in                 |
| Calendar event ends        | `POST /api/time/clock-out` `{ "id": … }`    |
| Daily 9:00                 | `GET /api/tasks?status=TODO` — today's list |
| Task created elsewhere     | `POST /api/tasks`                           |

The API is token-gated and rate-limited (120 req/min), so a runaway workflow can't hammer the database.
