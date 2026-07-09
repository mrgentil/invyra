import { NextResponse } from "next/server";
import { uploadEventImages } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const folder = String(form.get("folder") ?? "events/unknown").trim() || "events/unknown";
  const files = form.getAll("files").filter((v): v is File => v instanceof File && v.size > 0);

  if (!files.length) {
    return NextResponse.json({ urls: [] });
  }

  try {
    const urls = await uploadEventImages(files, folder);
    return NextResponse.json({ urls });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

