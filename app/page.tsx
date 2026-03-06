import { getEnv } from "@/lib/env";
import { getNotes, getRecommendations } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import HomePage from "./home";

export default async function Home() {
  const { DB } = await getEnv();
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  // Build a minimal request for auth check
  const fakeReq = new Request("http://localhost", {
    headers: { Cookie: cookie },
  });
  const user = await getCurrentUser(DB, fakeReq);

  const [notes, recommendations] = await Promise.all([
    getNotes(DB),
    getRecommendations(DB),
  ]);

  return (
    <HomePage
      notes={notes}
      recommendations={recommendations}
      user={user}
    />
  );
}
