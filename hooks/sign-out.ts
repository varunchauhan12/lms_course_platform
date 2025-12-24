"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";


export function SignOut() {
  const router = useRouter();

  const handleSignout = async function SignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
          toast.success("Signed out successfully.");
        },
        onError: () => {
          toast.error("Error signing out. Please try again.");
        }
      },
    })
  }
  return handleSignout;
}
