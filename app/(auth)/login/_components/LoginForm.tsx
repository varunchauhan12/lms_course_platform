"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { GithubIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTransition } from "react";



export default function LoginForm() {

    const [GithubLoading, startGithubTransition] = useTransition();

    async function SignInWithGithub() {
      startGithubTransition(async () => {
        await authClient.signIn.social({
          provider: "github",
          callbackURL: "/",
          fetchOptions: {
            onSuccess: () => {
              toast.success("Successfully signed in with Github");
            },
            onError: () => {
              toast.error(
                `Error signing in with Github: ${"Internal server error"}`
              );
            },
          },
        });
      });
    }
    return (
      <div>
        <div>
          {/* // back button */}
          <Link href={"/"}>
            <Button variant={"outline"} className="absolute top-4 left-4">
              <ArrowLeft />
              Back
            </Button>
          </Link>
        </div>
        <div className={"absolute top-4 right-4"}>
          <ModeToggle />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
              <CardAction>
                <Button variant={"outline"}>Sign Up</Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <form>
                <div className={"flex gap-2 mb-6"}></div>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Sign In with Email
              </Button>
              <Button
                disabled={GithubLoading}
                onClick={SignInWithGithub}
                variant="outline"
                className="w-full"
              >
                {GithubLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <GithubIcon className="mr-2" />
                    Sign in with Github
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          <div className="text-sm text-muted-foreground text-center px-8">
            By clicking Register, you agree to our Terms of Service and Privacy
            Policy.
          </div>
        </div>
      </div>
    );
}