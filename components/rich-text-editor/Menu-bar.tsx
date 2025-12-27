import React, { useState, useEffect } from "react";
import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Dot,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  ListIcon,
  ListOrderedIcon,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { cn } from "@/lib/tiptap-utils";
import { Button } from "../ui/button";

interface iAppProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: iAppProps) => {
  // --- CORRECT ORDER: Hooks must be FIRST ---

  // 1. Declare state
  const [ticker, setTicker] = useState(0);

  // 2. Declare effect
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => setTicker((prev) => prev + 1);

    editor.on("transaction", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("transaction", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  // --- SAFE TO RETURN NOW ---
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input rounded-t-lg p-2 bg-card flex gap-1 flex-wrap items-center">
      <TooltipProvider>
        {/* BOLD */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "border-0 hover:bg-gray-200",
                editor.isActive("bold") ? "text-blue-500" : "text-gray-500"
              )}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>

        {/* ITALIC (Example) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
              className={cn(
                "border-0 hover:bg-gray-200",
                editor.isActive("italic") ? "text-blue-500" : "text-gray-500"
              )}
            >
              <Italic className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("strike")}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
              className={cn(
                "border-0 hover:bg-gray-200",
                editor.isActive("strike") ? "text-blue-500" : "text-gray-500"
              )}
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Strike</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 1 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={cn(
                "border-0 hover:bg-gray-200",
                editor.isActive("heading", { level: 1 })
                  ? "text-blue-500"
                  : "text-gray-500"
              )}
            >
              <Heading1Icon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 2 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={cn(
                "border-0 hover:bg-gray-200",
                editor.isActive("heading", { level: 2 })
                  ? "text-blue-500"
                  : "text-gray-500"
              )}
            >
              <Heading2Icon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 3 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={cn(
                "border-0 hover:bg-gray-200",
                editor.isActive("heading", { level: 3 })
                  ? "text-blue-500"
                  : "text-gray-500"
              )}
            >
              <Heading3Icon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 3</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
              className={cn(
                "border-0 hover:bg-gray-200",
                editor.isActive("bulletList")
                  ? "text-blue-500"
                  : "text-gray-500"
              )}
            >
              <ListIcon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bullet List</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
              className={cn(
                "border-0 hover:bg-gray-200",
                editor.isActive("orderedList")
                  ? "text-blue-500"
                  : "text-gray-500"
              )}
            >
              <ListOrderedIcon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Ordered List</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-2"></div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "left" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("left").run()
              }
              className={cn(
                "border-0 hover:bg-gray-200",
                editor.isActive({ textAlign: "left" })
                  ? "text-blue-500"
                  : "text-gray-500"
              )}
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Align Left</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "center" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={cn(
                "border-0 hover:bg-gray-200",
                editor.isActive({ textAlign: "center" })
                  ? "text-blue-500"
                  : "text-gray-500"
              )}
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Align Center</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "right" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("right").run()
              }
              className={cn(
                "border-0 hover:bg-gray-200",
                editor.isActive({ textAlign: "right" })
                  ? "text-blue-500"
                  : "text-gray-500"
              )}
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Align Right</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-2"></div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"sm"}
              variant={"ghost"}
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"sm"}
              variant={"ghost"}
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MenuBar;
