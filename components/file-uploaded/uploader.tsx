"use client";

import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState } from "@/components/file-uploaded/RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
interface UploaderProps {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  ObjectUrl?: string;
  fileType: "image" | "video";
}
const Uploader = () => {
  const [fileState, setFileState] = useState<UploaderProps>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: "image",
  });
  async function uploadFile(file: File) {
    // Upload file logic here
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      const presignedUrl = await fetch("/api/s3/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          isImage: true,
        }),
      });

      if (!presignedUrl.ok) {
        toast.error("Failed to get presigned URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }

      const { preSignedUrl, key } = await presignedUrl.json();
    } catch {}
  }

  function FileRejection(filerejection: FileRejection[]) {
    if (filerejection.length) {
      const tooManyFiles = filerejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files",
      );

      const fileTooLarge = filerejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large",
      );

      if (fileTooLarge) {
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }

      if (tooManyFiles) {
        toast.error("You can only upload one file at a time.");
        return;
      }
    }
  }
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileState({
        file: file,
        uploading: false,
        progress: 0,
        ObjectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: "image",
      });
    }
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
