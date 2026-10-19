import { connection } from "next/server";
import { timeEntryClockInSchema } from "@atom/shared";
import { clockIn, getOwnerUser, getTimeOverview } from "@/lib/dal";

// GET — recent entries plus the currently open session, if any.
export async function GET() {
  await connection();
  const user = await getOwnerUser();
  const overview = await getTimeOverview(user.id);
  return Response.json(overview);
}

// POST — clock in. 409 when a session is already open.
export async function POST(request: Request) {
  await connection();
  const parsed = timeEntryClockInSchema.safeParse(
    await request.json().catch(() => ({})),
  );
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await getOwnerUser();
  const result = await clockIn(user.id, parsed.data.note);
  if (result.conflict) {
    return Response.json(
      { error: "A session is already open", openEntry: result.entry },
      { status: 409 },
    );
  }
  return Response.json(result.entry, { status: 201 });
}
