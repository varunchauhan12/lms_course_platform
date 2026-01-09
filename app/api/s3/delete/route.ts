import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Delete } from "lucide-react";
import { S3 } from "@/lib/S3Client";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const key = body.key;
    if (!key) {
      return new Response(JSON.stringify({ error: "Key is required" }), {
        status: 400,
      });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES!,
      Key: key,
    });

    await S3.send(command);

    return new Response(
      JSON.stringify({ message: "File deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Failed to delete file" }), {
      status: 500,
    });
  }
}
