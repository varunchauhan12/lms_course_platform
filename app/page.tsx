import { ModeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";

export default function Home() {
  return (
      <div className="absolute top-4 right-4">
        <ModeToggle/>
      </div>
  );
}
