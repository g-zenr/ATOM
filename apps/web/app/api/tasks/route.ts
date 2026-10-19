import { connection } from "next/server";
import { taskSchema, taskStatusSchema } from "@atom/shared";
import { createTask, getOwnerUser, listTasks } from "@/lib/dal";

// List tasks (with ?query=, ?status=, ?page=). Token-gated by proxy.ts.
export async function GET(request: Request) {
  await connection();
  const user = await getOwnerUser();
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query") ?? "";
  const status = taskStatusSchema.safeParse(searchParams.get("status"));
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  const result = await listTasks(user.id, {
    query,
    status: status.success ? status.data : undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  });
  return Response.json(result);
}

export async function POST(request: Request) {
  await connection();
  const parsed = taskSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await getOwnerUser();
  const task = await createTask(user.id, parsed.data);
  return Response.json(task, { status: 201 });
}
