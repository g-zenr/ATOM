import { connection } from "next/server";
import { noteSchema } from "@atom/shared";
import { createNote, getOwnerUser, listNotes } from "@/lib/dal";

// List notes (with ?query= and ?page=). Token-gated by proxy.ts.
export async function GET(request: Request) {
  await connection();
  const user = await getOwnerUser();
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query") ?? "";
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  const result = await listNotes(user.id, {
    query,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  });
  return Response.json(result);
}

export async function POST(request: Request) {
  await connection();
  const parsed = noteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await getOwnerUser();
  const note = await createNote(user.id, parsed.data);
  return Response.json(note, { status: 201 });
}
