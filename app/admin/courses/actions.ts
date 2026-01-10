"use server";

import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseFormData, courseSchema } from "@/lib/zodSchema";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { arcjetWithBot } from "@/lib/arcjet";
import { request } from "@arcjet/next";

export async function CreateCourseAction(
  values: CourseFormData,
): Promise<ApiResponse> {
  // Check if user is admin - will redirect to /not-admin if not
  const session = await requireAdmin();

  try {
    const req = await request();

    // Protect against bots and rate limiting
    const decision = await arcjetWithBot.protect(req, {
      userId: session.user.id,
    });

    console.log("Arcjet Decision:", decision);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Rate limit exceeded. Please try again later.",
        };
      }
      if (decision.reason.isBot()) {
        return {
          status: "error",
          message: "Bot detected. Access denied.",
        };
      }
      return {
        status: "error",
        message: "Request denied by security policy.",
      };
    }

    const validation = courseSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid course data",
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
