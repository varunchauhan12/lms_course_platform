"use client";

import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
} from "@/components/file-uploaded/RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Progress } from "@/components/ui/progress";

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
      const presignedResponse = await fetch("/api/s3/upload", {
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

      if (!presignedResponse.ok) {
        toast.error("Failed to get presigned URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }

      const { preSignedUrl, key } = await presignedResponse.json();

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageComplete = Math.round(
              (event.loaded / event.total) * 100
            );
            setFileState((prev) => ({
              ...prev,
              uploading: true,
              progress: percentageComplete,
              error: false,
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 100,
              error: false,
              key: key,
            }));

            toast.success("File uploaded successfully!");
            resolve(true);
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };

        xhr.open("PUT", preSignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch {
      toast.error("Upload failed");
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }));
    }
  }

  function FileRejection(filerejection: FileRejection[]) {
    if (filerejection.length) {
      const tooManyFiles = filerejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      const fileTooLarge = filerejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
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
      const fileInput = acceptedFiles[0];
      setFileState({
        file: fileInput,
        uploading: false,
        progress: 0,
        ObjectUrl: URL.createObjectURL(fileInput),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: "image",
      });
      uploadFile(fileInput);
    }
  }, []);

  function renderContent() {
    if (fileState.error) {
      return <RenderErrorState />;
    }

    if (fileState.uploading) {
      return (
        <div className="max-w-xs w-full text-center">
          <p className="mt-2">Uploading... {fileState.progress}%</p>
          <Progress value={fileState.progress} />
        </div>
      );
    }

    if (fileState.file && fileState.ObjectUrl) {
      return (
        <div className="text-center w-full max-w-xs">
          <img
            src={fileState.ObjectUrl}
            alt="Uploaded File"
            className="max-h-48 mx-auto mb-2 rounded-md object-contain"
          />
          <p className="break-all text-sm text-muted-foreground">
            {fileState.file.name}
          </p>
        </div>
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

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
          : "border-border hover:border-primary"
      )}
      {...getRootProps()}
    >
      <CardContent className={" flex items-center justify-center p-4 h-full"}>
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default Uploader;
