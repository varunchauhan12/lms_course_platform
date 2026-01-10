"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Loader2Icon, PlusIcon, SparkleIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  courseSchema,
  CourseFormData,
  courseCategories,
  levels,
  courseStatus,
} from "@/lib/zodSchema";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploaded/uploader";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourseAction } from "@/app/admin/courses/actions";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fileKey: "",
      price: 0,
      duration: 0,
      level: "BEGINNER",
      category: "Development",
      smallDescription: "",
      slug: "",
      status: "DRAFT",
    },
  });

  function onSubmit(values: CourseFormData) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        CreateCourseAction(values),
      );
      if (error) {
        toast.error("Failed to create course. Please try again.");
        return;
      }

      if (result?.status === "success") {
        toast.success("Course created successfully!");

        form.reset();
        router.push("/admin/courses");
      } else if (result?.status === "error") {
        toast.error(`Failed to create course: ${result.message}`);
      }
    });

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
          <Form {...form}>
            <form
              className={"space-y-6"}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={"font-bold"}>Title</FormLabel>
                    <FormControl>
                      <Input placeholder={"title"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name={"title"}
                control={form.control}
              />

              <div className={"flex gap-4 items-end"}>
                <FormField
                  render={({ field }) => (
                    <FormItem className={"w-full"}>
                      <FormLabel className={"font-bold"}>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder={"Slug"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  name={"slug"}
                  control={form.control}
                />
                <Button
                  type={"button"}
                  className={"w-fit"}
                  onClick={() => {
                    const title = form.getValues("title");
                    const slug = title
                      .toLowerCase()
                      .replace(/ /g, "-")
                      .replace(/[^\w-]+/g, "");
                    form.setValue("slug", slug, { shouldValidate: true });
                  }}
                >
                  Generate Slug
                  <SparkleIcon className={"ml-1"} size={16} />
                </Button>
              </div>

              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={"font-bold"}>
                      Small Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={"Small Description"}
                        className={"min-h-[80px]"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name={"smallDescription"}
                control={form.control}
              />

              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={"font-bold"}>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                      {/*<Textarea*/}
                      {/*  placeholder={"Description"}*/}
                      {/*  className={"min-h-[150px]"}*/}
                      {/*  {...field}*/}
                      {/*/>*/}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name={"description"}
                control={form.control}
              />

              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={"font-bold"}>
                      Thumbnail Image
                    </FormLabel>
                    <FormControl>
                      <Uploader value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name={"fileKey"}
                control={form.control}
              />

              <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={"font-bold"}>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={"w-full"}>
                            <SelectValue placeholder={"Select Category"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                  name={"category"}
                  control={form.control}
                />
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={"font-bold"}>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={"w-full"}>
                            <SelectValue placeholder={"Select Level"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {levels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                  name={"level"}
                  control={form.control}
                />

                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={"font-bold"}>
                        Duration (hours)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Duration"}
                          type={"number"}
                          {...field}
                          value={isNaN(field.value) ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  name={"duration"}
                  control={form.control}
                />

                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={"font-bold"}>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Price"}
                          type={"number"}
                          {...field}
                          value={isNaN(field.value) ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  name={"price"}
                  control={form.control}
                />
              </div>

              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={"font-bold"}>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={"w-full"}>
                          <SelectValue placeholder={"Select Status"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseStatus.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
                name={"status"}
                control={form.control}
              />

              <Button type={"submit"} className={"my-5"} disabled={isPending}>
                {isPending ? (
                  <>
                    Creating..
                    <Loader2Icon className={"animate-spin ml-1"} />
                  </>
                ) : (
                  <>
                    Create Course <PlusIcon className={"ml-1"} size={16} />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
