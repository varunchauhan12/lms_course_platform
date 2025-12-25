import { z } from "zod";

export const courseCategories = [
  "Development",
  "Business",
  "Finance",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Music",
  "Teaching & Academics",
] as const;

export const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const courseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  fileKey: z.string().min(1, "File key is required"),
  price: z.number().min(0, "Price must be a positive number"),
  duration: z.number().min(1, "Duration must be at least 1"),
  level: z.enum(levels, "Level is required"),
  category: z.enum(courseCategories , "Category is required"),
  smallDescription: z.string().min(1, "Small description is required"),
  slug: z.string().min(1, "Slug is required"),
  courseStatus: z.enum(courseStatus, "Course status is required"),
});

// Export the output type for use with your form
export type CourseFormData = z.output<typeof courseSchema>;