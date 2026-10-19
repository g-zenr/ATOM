# Tasks

> Chapter 5 — Features · [Contents](../table-of-contents.md)

_Track work with a GitHub Issues–style workflow: **Todo → In Progress → Done**._

## UI (`app/tasks/page.tsx`)

- GET search form (`?query=`)
- Status filter tabs: **All / Todo / In Progress / Done** (`?status=`)
- Create form: title (required), description, priority (LOW/MEDIUM/HIGH), status (default TODO)
- Each task row has three status buttons — click to move the task
- Pagination: 20 per page, preserving query + filter

## Behavior

- Search matches title **or** description, case-insensitive
- Status and priority are Prisma enums; the Zod enum is the single source of valid values
- Moving status is a Server Action (`setTaskStatusAction`) → `updateMany({ id, userId })`

## Layers

| Layer         | Where                                                              |
| ------------- | ------------------------------------------------------------------ |
| Server Action | `app/actions/tasks.ts` — `createTaskAction`, `setTaskStatusAction` |
| DAL           | `lib/dal.ts` — `listTasks`, `createTask`, `setTaskStatus`          |
| API           | `GET/POST /api/tasks`                                              |
| Schema        | `Task` model + `taskSchema` (Zod)                                  |

**Zod contract:** `title` 1–200, `description` ≤ 20,000 optional, `status` ∈ `TODO|IN_PROGRESS|DONE` (default `TODO`), `priority` ∈ `LOW|MEDIUM|HIGH` (default `MEDIUM`), `dueDate` optional date.
