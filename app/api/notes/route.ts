import { getEnv } from "@/lib/env";
import { getNotes, createNote } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const { DB } = await getEnv();
  const notes = await getNotes(DB);
  return Response.json({ notes });
}

export async function POST(request: Request) {
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

  if (!body.title || !body.content) {
    return Response.json({ error: "Title and content required" }, { status: 400 });
  }

  const id = await createNote(DB, {
    title: body.title,
    author: body.author || "",
    content: body.content,
    cover_url: body.cover_url || "",
  });

  return Response.json({ id });
}
