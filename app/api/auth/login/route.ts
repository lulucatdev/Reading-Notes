import { getEnv } from "@/lib/env";

export async function GET(request: Request) {
  const { GITHUB_CLIENT_ID } = await getEnv();
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/callback`;

  const githubUrl = new URL("https://github.com/login/oauth/authorize");
  githubUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
  githubUrl.searchParams.set("redirect_uri", redirectUri);
  githubUrl.searchParams.set("scope", "read:user");

  return Response.redirect(githubUrl.toString(), 302);
}
