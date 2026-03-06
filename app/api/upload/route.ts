import { getEnv } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const { DB, IMAGES } = await getEnv();
  const user = await getCurrentUser(DB, request);

  if (!user?.isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  // Generate unique filename
  const ext = "webp";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const key = `uploads/${timestamp}-${random}.${ext}`;

  // Upload to R2
  await IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: "image/webp" },
  });

  // Return the URL (served via R2 public access or custom domain)
  const url = `/images/${key}`;
  return Response.json({ url, key });
}
