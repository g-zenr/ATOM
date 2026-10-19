# Change log

> Chapter 11 — Standards audit · [Contents](../table-of-contents.md)

**Pass 1 — audit gaps:** error/404 boundaries, search + status filters, form labels, security headers, boilerplate cleanup, actions refactor.

**Pass 2 — deferred standards:** Neon Auth (packages, handler route, sign-in/sign-up pages, lazy auth instance, proxy session gate, `authUserId` schema link), server-only DAL with owner-scoped API access, rate limiting, pagination, `@next/bundle-analyzer`, Playwright E2E suite.

**Pass 3 — documentation:** the book itself (`book/`), Playwright MCP server added to OpenCode, `.env.example` corrections (`DATABASE_URL_UNPOOLED`, `ATOM_API_URL`).
