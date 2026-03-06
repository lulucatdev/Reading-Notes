import { getEnv } from "@/lib/env";
import { getNoteById } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import NoteDetail from "./detail";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { DB } = await getEnv();

  const note = await getNoteById(DB, parseInt(id));
  if (!note) {
    return (
      <div className="app" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2>Note not found</h2>
        <a href="/" className="back-link">
          Back to home
        </a>
      </div>
    );
  }

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";
  const fakeReq = new Request("http://localhost", {
    headers: { Cookie: cookie },
  });
  const user = await getCurrentUser(DB, fakeReq);

  return <NoteDetail note={note} user={user} />;
}
