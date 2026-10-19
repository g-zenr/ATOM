# Documentation rules

> Chapter 12 — Rules & standards · [Contents](../table-of-contents.md)

The book (`book/`) is the project's source of truth. **The book ships with the code, not after it.**

- **New feature** → a page in `book/features/` (or update the existing feature page), documenting UI → Action → DAL → API → schema.
- **New endpoint** → a page in `book/api/`, with params, response shape, and a curl example.
- **New environment variable** → update `book/quick-start/environment.md` **and** `.env.example` in the same change.
- **New script or command** → `book/quick-start/dev-loop.md`.
- **Schema change** → `book/data/schema.md`.
- **New chapter or page** → update `book/table-of-contents.md` and the structure tree in `book/README.md`.
- **Every page** carries the breadcrumb line (`> Chapter N — … · [Contents](../table-of-contents.md)`).
- **Keep the standards audit** (`book/standards/`) honest: when something is added or deferred, record it in `change-log.md`.
