import { getEnv } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import NoteEditor from "../components/note-editor";

export default async function WritePage() {
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

  return <NoteEditor />;
}
