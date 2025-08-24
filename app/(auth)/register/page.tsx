import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <div>
         <div>
                {/* // back button */}
                <Link href={'/'}>
                <Button variant={'outline'} className="absolute top-4 left-4">
                    <ArrowLeft/>
                    Back
                    </Button>
                </Link>
            </div>
      <div className={"absolute top-4 right-4"}>
        <ModeToggle />
      </div>
      <div className="flex flex-col gap-2 justify-center
        items-center">
        <div className="text-2xl font-bold">Welcome To LMS</div>
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
            <CardAction>
              <Button variant={"outline"}>Login</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Register
            </Button>
            <Button variant="outline" className="w-full">
              Register with Google
            </Button>
          </CardFooter>
        </Card>
        <div className="text-sm text-muted-foreground text-center px-8">
          By clicking Register, you agree to our Terms of Service and Privacy Policy.
          
        </div>
      </div>
    </div>
  );
}
