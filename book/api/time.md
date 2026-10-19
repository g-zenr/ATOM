# Time endpoints

> Chapter 6 — API reference · [Contents](../table-of-contents.md)

## `GET /api/time`

Recent entries (30, newest first) plus the currently open session, if any.

```json
{
  "entries": [
    {
      "id": "…",
      "start": "…",
      "end": "…|null",
      "duration": 28800,
      "date": "…",
      "note": "…",
      "durationFormatted": "8:00:00"
    }
  ],
  "openEntry": null
}
```

## `POST /api/time`

Clock in. Body: `{ "note"? (≤ 500) }`. `201 Created` → the open entry. `409 Conflict` if a session is already open: `{ "error": "A session is already open", "openEntry": { … } }`.

## `POST /api/time/clock-out`

Close the open session. Body: `{ "id": "<entry id>" }`. Returns the updated entry with `end` and computed `duration`. `404` if no open session has that id.

```bash
curl -X POST localhost:3000/api/time/clock-out \
  -H "Authorization: Bearer $ATOM_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"cmv…"}'
```

Getting the open session id for clock-out: `GET /api/time` → `openEntry.id`.
