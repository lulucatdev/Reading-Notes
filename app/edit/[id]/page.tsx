import { getEnv } from "@/lib/env";
import { getNoteById } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import NoteEditor from "../../components/note-editor";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { DB } = await getEnv();
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";
  const fakeReq = new Request("http://localhost", {
    headers: { Cookie: cookie },
  });
  const user = await getCurrentUser(DB, fakeReq);

  if (!user?.isAdmin) {
    redirect("/");
  }

  const note = await getNoteById(DB, parseInt(id));
  if (!note) {
    redirect("/");
  }

  return (
    <NoteEditor
      initialNote={{
        id: note.id,
        title: note.title,
        author: note.author,
        content: note.content,
        cover_url: note.cover_url,
      }}
    />
  );
}
