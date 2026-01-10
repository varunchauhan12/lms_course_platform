import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3 } from "@/lib/S3Client";
import { arcjetWithFileUploadRateLimit } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import ip from "@arcjet/ip";

export async function DELETE(request: Request) {
  // Check admin status - API routes must return JSON, not redirect
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 },
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden. Admin access required." },
      { status: 403 },
    );
  }

  // Use userId if logged in, otherwise use IP address
  const userId = session.user.id || ip(request) || "anonymous";

  try {
    const decision = await arcjetWithFileUploadRateLimit.protect(request, {
      userId,
    });

    console.log("Arcjet Delete Decision:", decision);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: "Too many delete requests. Please try again later." },
          { status: 429 },
        );
      }
      return NextResponse.json({ error: "Request denied" }, { status: 403 });
    }
    const body = await request.json();
    const key = body.key;
    if (!key) {
      return new Response(JSON.stringify({ error: "Key is required" }), {
        status: 400,
      });
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(command);

    return new Response(
      JSON.stringify({ message: "File deleted successfully" }),
      {
        status: 200,
      },
    );
  } catch {
    return new Response(JSON.stringify({ error: "Failed to delete file" }), {
      status: 500,
    });
  }
}
