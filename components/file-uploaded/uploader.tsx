"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderSuccessState,
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

interface iAppProps {
  value?: string;
  onChange?: (value: string) => void;
}

const Uploader = ({ value, onChange }: iAppProps) => {
  const [fileState, setFileState] = useState<UploaderProps>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: "image",
    key: value || "",
  });

  // This is the upload file function which try to get the presigned URL from the s3/upload route and then upload the file to S3 using that URL , it uses XHR to track progress of the upload

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

            onChange?.(key);

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

  // This function handles rejected files when the user tries to upload invalid files
  // It checks if the file is too large (over 5MB) or if the user tried to upload multiple files
  // and shows an appropriate error toast message
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

  // This function is called when the user drops a file or selects one via the file picker
  // It creates a preview URL for the image, cleans up the old URL if any, and starts the upload
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const fileInput = acceptedFiles[0];

        if (fileState.ObjectUrl && !fileState.ObjectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.ObjectUrl);
        }
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
    },
    [fileState.ObjectUrl]
  );

  // This function deletes the uploaded file from S3 storage
  // It calls the delete API, cleans up the preview URL from memory, and resets the state
  async function handleRemove() {
    if (fileState.isDeleting || !fileState.ObjectUrl) {
      return;
    }

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to delete file");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
        }));
        return;
      }

      if (fileState.ObjectUrl && !fileState.ObjectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.ObjectUrl);
      }

      onChange?.("");

      setFileState({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        ObjectUrl: undefined,
        fileType: "image",
      });

      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Failed to delete file");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
      }));
    }
  }

  // This function decides what to show in the uploader based on the current state:
  // - Error state: shows error message
  // - Uploading: shows progress bar with percentage
  // - File uploaded: shows the image preview with filename
  // - Empty: shows the drag & drop prompt
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
        <RenderSuccessState
          fileName={fileState.file.name}
          fileURL={fileState.ObjectUrl}
          isDeleting={fileState.isDeleting}
          handleRemove={handleRemove}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }
  // Clean up object URL on unmount or when file changes

  useEffect(() => {
    return () => {
      if (fileState.ObjectUrl && !fileState.ObjectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.ObjectUrl);
      }
    };
  }, [fileState.ObjectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
    disabled:
      fileState.uploading ||
      fileState.isDeleting ||
      Boolean(fileState.ObjectUrl),
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
