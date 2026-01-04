import React from "react";
import { CloudUploadIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const RenderEmptyState = ({
  isDragActive,
}: {
  isDragActive: boolean;
}) => {
  return (
    <div className={"text-center"}>
      <div
        className={
          "flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4"
        }
      >
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary",
          )}
        />
      </div>
      <p>
        Drop your files here or{" "}
        <span className={"font-bold cursor-pointer text-primary"}>
          Click to Upload..
        </span>
      </p>
    </div>
  );
};

export const RenderErrorState = () => {
  return (
    <div className={"text-center text-destructive"}>
      <div
        className={
          "flex items-center justify-center mx-auto size-12 rounded-full bg-destructive/30 mb-4"
        }
      >
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className={"text-base font-semibold"}>Upload Failed</p>
      <p className={"text-xs mt-1"}>Something went wrong</p>
    </div>
  );
};
