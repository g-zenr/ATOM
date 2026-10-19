/**
 * ATOM Discord bot — skeleton.
 *
 * Run: npm run bot   (from the repo root)
 * Env: DISCORD_TOKEN from https://discord.com/developers/applications
 *
 * The bot talks to ATOM through the same REST API that n8n calls
 * (apps/web route handlers), guarded by ATOM_API_TOKEN:
 *
 *   fetch(`${ATOM_API_URL}/api/notes`, {
 *     headers: { Authorization: `Bearer ${process.env.ATOM_API_TOKEN}` },
 *   })
 */

import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  type Message,
} from "discord.js";

const token = process.env.DISCORD_TOKEN;
const apiUrl = process.env.ATOM_API_URL ?? "http://localhost:3000";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`[atom-discord] logged in as ${readyClient.user.tag}`);
  console.log(`[atom-discord] API target: ${apiUrl}`);
});

client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    await message.reply("pong — ATOM is online");
  }

  if (message.content === "!help") {
    await message.reply(
      "ATOM commands: !ping — !tasks — !clockin — !clockout (endpoints land here soon)",
    );
  }
});

if (token) {
  client.login(token);
} else {
  console.log(
    "[atom-discord] DISCORD_TOKEN is not set — add it to the root .env, then run again.",
  );
}
