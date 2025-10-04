"use client";

import { ModeToggle } from "@/components/ui/theme-toggle";
import {authClient} from "@/lib/auth-client";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
export default function Home() {

    const router = useRouter();
    const {
        data: session,
    } = authClient.useSession()

    async function SignOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login"); // redirect to login page
                    toast.success("Successfully signed out");
                },
            },
        })
    }
    return (
      <div className="absolute top-4 right-4">
        <ModeToggle/>
        {session ? (
          <div><p>

              {session.user.name}
          </p>
              <Button onClick={SignOut}>SignOut</Button>
          </div>
        ): (
          <Button>Login</Button>
        )}
      </div>
  );
}
