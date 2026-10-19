# Schema

> Chapter 7 — Data · [Contents](../table-of-contents.md)

`packages/db/prisma/schema.prisma`

```text
User (1) ──< Note
User (1) ──< Task
User (1) ──< TimeEntry
```

## User

| Field        | Type    | Notes                                               |
| ------------ | ------- | --------------------------------------------------- |
| `id`         | String  | cuid, PK                                            |
| `authUserId` | String? | **unique** — links to Neon Auth's `neon_auth.users` |
| `email`      | String  | unique                                              |
| `name`       | String? |                                                     |

## Note

`title` (String), `content` (Text), `tags` (String[]), timestamps. Index: `(userId, updatedAt)`.

## Task

`title`, `description` (Text?), `status` (enum `TODO | IN_PROGRESS | DONE`, default `TODO`), `priority` (enum `LOW | MEDIUM | HIGH`, default `MEDIUM`), `dueDate` (DateTime?). Indexes: `(userId, status)`, `(userId, updatedAt)`.

## TimeEntry

`start` (DateTime), `end` (DateTime?), `duration` (Int?, seconds — computed on clock-out), `date` (Date), `note` (String?). Index: `(userId, date)`.

**All three child tables cascade-delete with their user.**
