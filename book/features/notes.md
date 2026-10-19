# Notes

> Chapter 5 — Features · [Contents](../table-of-contents.md)

_Capture and revisit information._

## UI (`app/notes/page.tsx`)

- GET search form (`?query=`) — works without JavaScript, keeps search in the URL
- Create form: title (required, 200 chars), body (20,000 chars)
- List: title, body, tags, "Updated …" timestamp, delete button
- Pagination: 20 per page, prev/next links that preserve the search query

## Behavior

- Search matches title **or** content, case-insensitive (`contains … mode: "insensitive"`)
- Results stream through `<Suspense key={query:page}>` with a skeleton fallback
- Deleting uses `deleteMany({ id, userId })` — ownership enforced in the DAL

## Layers

| Layer         | Where                                                           |
| ------------- | --------------------------------------------------------------- |
| Server Action | `app/actions/notes.ts` — `createNoteAction`, `deleteNoteAction` |
| DAL           | `lib/dal.ts` — `listNotes`, `createNote`, `deleteNote`          |
| API           | `GET/POST /api/notes`                                           |
| Schema        | `Note` model + `noteSchema` (Zod)                               |

**Zod contract** (`packages/shared`): `title` 1–200 chars (trimmed), `content` ≤ 20,000 (default `""`), `tags` ≤ 10 strings of ≤ 50 chars (default `[]`).
