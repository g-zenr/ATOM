import { connection } from "next/server";
import { timeEntryClockOutSchema } from "@atom/shared";
import { clockOut, getOwnerUser } from "@/lib/dal";

// POST { id } — close an open session and compute its duration.
export async function POST(request: Request) {
  await connection();
  const parsed = timeEntryClockOutSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await getOwnerUser();
  const entry = await clockOut(user.id, parsed.data.id);
  if (!entry) {
    return Response.json(
      { error: "No open session with that id" },
      { status: 404 },
    );
  }
  return Response.json(entry);
}
