import { AlertCircle, Home, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotAdminPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/20">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold">Access Denied</CardTitle>
          <CardDescription className="text-base">
            Administrator privileges required
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-center text-sm text-muted-foreground">
              You need administrator privileges to access this resource. This
              area is restricted to administrators only.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-center text-muted-foreground">
              If you believe you should have access, please contact your system
              administrator.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full" size="lg">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with different account
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
