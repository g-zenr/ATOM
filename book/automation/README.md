# Automation with ATOM

> Chapter 8 — Automation · [Contents](../table-of-contents.md)

The REST API ([chapter 6](../api/overview.md)) is the integration surface. Two consumers are planned: **n8n** (workflows) and the **Discord bot**.

**Design note:** both integrations go through the **same API** the future mobile app will use, authenticated by the same `ATOM_API_TOKEN`. There is no second interface to keep in sync — the DAL is the single implementation of the data rules.

- [n8n](./n8n.md) — HTTP Request node patterns and recipes
- [Discord bot](./discord.md) — commands, wiring, environment
