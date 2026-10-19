# Time tracking

> Chapter 5 — Features · [Contents](../table-of-contents.md)

_Clock in and out of work sessions._

## UI (`app/time/page.tsx`)

- If **no session is open**: "Clock in" button + optional session note
- If **a session is open**: live "Clocked in since …" state + "Clock out" button
- Recent entries list (30): date, note, formatted duration (`m:ss` / `h:mm:ss`) or "open"

## Behavior

- **One open session per user** — clocking in while one is open is a conflict (API returns `409`)
- Clock-out computes `duration` in seconds server-side (`durationSeconds`) and stamps it on the row
- `formatDuration(seconds)` renders `m:ss` or `h:mm:ss` — shared by API and UI

## Layers

| Layer         | Where                                                                    |
| ------------- | ------------------------------------------------------------------------ |
| Server Action | inline in `app/time/page.tsx` (`clockIn`, `clockOut`)                    |
| DAL           | `lib/dal.ts` — `getTimeOverview`, `clockIn`, `clockOut`                  |
| API           | `GET/POST /api/time`, `POST /api/time/clock-out`                         |
| Schema        | `TimeEntry` model + `timeEntryClockInSchema` / `timeEntryClockOutSchema` |

**Zod contract:** clock-in takes optional `note` (≤ 500 chars); clock-out takes `id` (required).
