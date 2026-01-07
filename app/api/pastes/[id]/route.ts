import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Get current time (supports TEST_MODE)
function getNow(request: Request): number {
  if (
    process.env.TEST_MODE === "1" &&
    request.headers.get("x-test-now-ms")
  ) {
    return Number(request.headers.get("x-test-now-ms"));
  }
  return Date.now();
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  // If paste not found
  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow(request);

  // TTL check
  if (paste.expires_at && now > paste.expires_at) {
    await kv.del(key);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // View limit check
  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    paste.remaining_views -= 1;
    await kv.set(key, paste);
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}