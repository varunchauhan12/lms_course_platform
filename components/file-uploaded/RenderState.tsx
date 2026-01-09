import React from "react";
import { CloudUploadIcon, ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

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
            isDragActive && "text-primary"
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

export const RenderSuccessState = ({
  fileName,
  fileURL,
  isDeleting,
  handleRemove,
}: {
  fileName: string;
  fileURL: string;
  isDeleting?: boolean;
  handleRemove?: () => void;
}) => {
  return (
    <div className="flex justify-between items-start gap-4">
      <div className="text-center max-w-2xs w-full">
        <img
          src={fileURL}
          alt="Uploaded File"
          className="max-h-48 mx-auto mb-2 rounded-md object-contain"
        />
        <p className="break-all text-sm text-muted-foreground">{fileName}</p>
      </div>

      <Button
        variant="destructive"
        size="icon"
        className="absolute right-4 topo-4"
        onClick={handleRemove}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
};
