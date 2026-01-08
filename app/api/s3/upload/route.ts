import { z } from "zod";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Client";
import { v4 as uuidv4 } from "uuid";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  fileType: z.string().min(1, { message: "File type is required" }),
  fileSize: z.number().min(1, { message: "File size is required" }),
  isImage: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const validation = fileUploadSchema.safeParse(body);
    console.log("Validation result:", validation);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    const { fileName, fileType, fileSize } = validation.data;
    console.log("Validated data:", { fileName, fileType, fileSize });

    const uniqueFileName = `${uuidv4()}-${fileName}`;
    console.log("Generating pre-signed URL for file:", uniqueFileName);
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: fileType,
      ContentLength: fileSize,
      Key: uniqueFileName,
    });

    console.log("PutObjectCommand created:", command);

    const preSignedUrl = await getSignedUrl(S3, command, { expiresIn: 360 });
    console.log("Generated pre-signed URL:", preSignedUrl);

    const response = {
      preSignedUrl,
      key: uniqueFileName,
    };
    console.log("Response to be sent:", response);

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate pre-signed URL" },
      { status: 500 },
    );
  }
}
