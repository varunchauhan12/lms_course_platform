import { z } from "zod";
import { NextResponse } from "next/server";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  fileType: z.string().min(1, { message: "File type is required" }),
  fileSize: z.number().min(1, { message: "File size is required" }),
  isImage: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    const { fileName, fileType, fileSize } = validation.data;
  } catch {}
}
