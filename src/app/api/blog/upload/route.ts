import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

function getR2Client() {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getR2Client();
  if (!client || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
    return NextResponse.json(
      { error: "R2 storage not configured. Add R2_* env vars." },
      { status: 503 }
    );
  }

  let file: { data: Buffer; type: string; name: string };
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const f = formData.get("file") as File | null;
      if (!f) {
        return NextResponse.json({ error: "Missing file" }, { status: 400 });
      }
      const buf = Buffer.from(await f.arrayBuffer());
      const name = (f.name || "image").replace(/[^a-zA-Z0-9.-]/g, "_");
      file = { data: buf, type: f.type || "application/octet-stream", name };
    } else {
      const body = await request.json();
      const base64 = body?.file ?? body?.base64;
      const type = body?.type ?? body?.contentType ?? "image/png";
      const name = (body?.filename ?? "image.png").replace(/[^a-zA-Z0-9.-]/g, "_");
      if (!base64) {
        return NextResponse.json({ error: "Missing file or base64" }, { status: 400 });
      }
      const data = Buffer.from(base64, "base64");
      file = { data, type, name };
    }
  } catch (e) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop()! : "png";
  const key = `media/${new Date().getFullYear()}/${randomUUID()}.${ext}`;

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file.data,
      ContentType: file.type,
    })
  );

  const url = `${R2_PUBLIC_URL}/${key}`;
  return NextResponse.json({ success: 1, file: { url } });
}
