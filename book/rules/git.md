# Git rules

> Chapter 12 — Rules & standards · [Contents](../table-of-contents.md)

## Commits

- **Lowercase imperative:** `add note search`, `fix clock-out conflict` — describe the change, not the task.
- **One logical change per commit.** Formatting-only changes go in their own commit.
- **Check before you commit:** `npm run format:check` (and the full verification loop for non-trivial changes).

## What never gets committed

- `.env` (secrets — git-ignored)
- `node_modules/`, `.next/`, `test-results/`, `playwright-report/`, `.playwright-mcp/`
- Generated files that are reproducible (`prisma` client output is generated on install)

## Branching

- Work happens on `dev-<feature>` branches — **keep the Git branch name in sync with the Neon branch** (`neon checkout dev-<feature> --create`) so schema changes land on the same-named branch.
- Merge to `production` (the linked Neon branch) only when the verification loop is green.

## Secrets

- If a secret ever lands in a commit, treat it as compromised: rotate it, then rewrite history or accept the exposure — rotation is the fix, not deletion.
