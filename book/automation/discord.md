# Discord bot

> Chapter 8 — Automation · [Contents](../table-of-contents.md)

`packages/discord` — a discord.js skeleton, run with `npm run bot`.

## Commands today

| Command | Reply                   |
| ------- | ----------------------- |
| `!ping` | "pong — ATOM is online" |
| `!help` | command list            |

**Planned (the bot calls the REST API):** `!tasks` (list TODOs), `!clockin`, `!clockout`, note capture from messages.

## How it connects

`packages/discord/src/index.ts`:

```ts
fetch(`${ATOM_API_URL}/api/notes`, {
  headers: { Authorization: `Bearer ${ATOM_API_TOKEN}` },
});
```

## Environment

- `DISCORD_TOKEN` — from the Discord Developer Portal → Bot → Token
- `ATOM_API_URL` — optional, the bot's API target (defaults to `http://localhost:3000`)

The bot logs its API target on startup, so a wrong value is easy to spot.
