# Shared UI machinery

> Chapter 5 — Features · [Contents](../table-of-contents.md)

- **`Pagination`** (`app/components/pagination.tsx`) — prev/next from `?page=`, preserves filters via the `basePath` query string
- **Quick capture** (`app/components/quick-capture.tsx`) — global FAB/composer backed by the same `createNoteAction`
- **Theme** — Zustand store (`store/ui-store.ts`) with light/dark/system, persisted to `localStorage` under key `atom-ui`
- **`cn()`** (`lib/cn.ts`) — `clsx` + `tailwind-merge` for conditional class composition
