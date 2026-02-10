import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

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

export async function GET() {
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
      { error: "R2 storage not configured." },
      { status: 503 }
    );
  }

  const items: { key: string; url: string; size: number; lastModified: string }[] = [];
  let continuationToken: string | undefined;

  try {
    do {
      const command = new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: "media/",
        MaxKeys: 500,
        ContinuationToken: continuationToken,
      });
      const response = await client.send(command);

      for (const obj of response.Contents ?? []) {
        if (obj.Key) {
          items.push({
            key: obj.Key,
            url: `${R2_PUBLIC_URL}/${obj.Key}`,
            size: obj.Size ?? 0,
            lastModified: obj.LastModified?.toISOString() ?? "",
          });
        }
      }
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);
  } catch (err: unknown) {
    const code = err && typeof err === "object" && "Code" in err ? (err as { Code?: string }).Code : undefined;
    if (code === "Unauthorized" || code === "AccessDenied" || (err as Error)?.name === "Unauthorized") {
      return NextResponse.json(
        {
          error: "R2 access denied. Check R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, bucket name, and that the API token has Object Read & List permissions.",
        },
        { status: 502 }
      );
    }
    throw err;
  }

  // Newest first
  items.sort((a, b) => (b.lastModified > a.lastModified ? 1 : -1));

  return NextResponse.json({ items });
}
