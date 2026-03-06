import { getEnv } from "@/lib/env";
import { getNoteById, updateNote, deleteNote } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { DB } = await getEnv();
  const note = await getNoteById(DB, parseInt(id));

  if (!note) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ note });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { DB } = await getEnv();
  const user = await getCurrentUser(DB, request);

  if (!user?.isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = (await request.json()) as {
    title: string;
    author: string;
    content: string;
    cover_url: string;
  };

  await updateNote(DB, parseInt(id), {
    title: body.title,
    author: body.author || "",
    content: body.content,
    cover_url: body.cover_url || "",
  });

  return Response.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { DB } = await getEnv();
  const user = await getCurrentUser(DB, request);

  if (!user?.isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  await deleteNote(DB, parseInt(id));
  return Response.json({ success: true });
}
