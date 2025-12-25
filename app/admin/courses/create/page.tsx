"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { courseSchema, CourseFormData } from "@/lib/zodSchema";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function CreateCoursePage() {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fileKey: "",
      price: 0,
      duration: 0,
      level: "BEGINNER",
      category: "",
      smallDescription: "",
      slug: "",
      courseStatus: "DRAFT",
    },
  });

  function onSubmit(values: CourseFormData) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);
  }

  return (
    <>
      <div className={"flex items-center gap-4"}>
        <Link
          href={"/admin/courses"}
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft />
        </Link>
        <h1 className={"text-2xl font-bold"}>Create Courses</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide basic information for the course{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form  {...form}>
            <form
              className={"space-y-6"}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder={"title"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name={"title"}
                control={form.control}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
