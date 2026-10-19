# Notes endpoints

> Chapter 6 — API reference · [Contents](../table-of-contents.md)

## `GET /api/notes`

List notes, newest first. **Query params:** `query` (case-insensitive title/content search), `page` (1-based, default 1, 20 per page).

```json
{
  "notes": [
    {
      "id": "…",
      "title": "…",
      "content": "…",
      "tags": [],
      "createdAt": "…",
      "updatedAt": "…",
      "userId": "…"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 20,
  "totalPages": 3
}
```

## `POST /api/notes`

Create a note. Body: `{ "title": string (1–200, required), "content": string (≤ 20,000), "tags": string[] (≤ 10) }`.

`201 Created` → the created note.

```bash
curl -X POST localhost:3000/api/notes \
  -H "Authorization: Bearer $ATOM_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"From n8n","content":"created by automation","tags":["n8n"]}'
```
