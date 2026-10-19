# Tasks endpoints

> Chapter 6 — API reference · [Contents](../table-of-contents.md)

## `GET /api/tasks`

List tasks, newest first. **Query params:** `query` (title/description search), `status` (`TODO|IN_PROGRESS|DONE`), `page`. Response shape mirrors notes (`tasks`, `total`, `page`, `pageSize`, `totalPages`).

## `POST /api/tasks`

Create a task. Body: `{ "title" (required), "description"?, "status"? (default TODO), "priority"? (default MEDIUM), "dueDate"? (ISO date) }`. `201 Created` → the created task.

```bash
curl -X POST localhost:3000/api/tasks \
  -H "Authorization: Bearer $ATOM_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship docs","priority":"HIGH"}'
```
