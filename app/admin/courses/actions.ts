"use server";

import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseFormData, courseSchema } from "@/lib/zodSchema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function CreateCourseAction(
  values: CourseFormData,
): Promise<ApiResponse> {
  // Here you would typically handle the form submission,
  // such as saving the course data to your database.

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
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
        userId: session?.user.id as string,
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
