"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState } from "@/components/file-uploaded/RenderState";

const Uploader = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    // Do something with the files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
  });

  return (
    <Card
      className={cn(
        "relative  border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 ",
        isDragActive
          ? "border-primary border-solid bg-primary/10 "
          : "border-border hover:border-primary",
      )}
      {...getRootProps()}
    >
      <CardContent className={" flex items-center justify-center p-4 h-full"}>
        <input {...getInputProps()} />
        <RenderEmptyState isDragActive={isDragActive} />
      </CardContent>
    </Card>
  );
};

export default Uploader;
