"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function VerifyRequestPage() {
  const router = useRouter();
  const [Otp, setOtp] = useState("");
  const params = useSearchParams();
  const email = params.get("email") as string;
  const [emailPending, startTransition] = useTransition();

  const isOtpCompleted = Otp.length === 6;

  /// this function verifies the code entered by the user
  function VerifyCode() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: Otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified successfully");
            setTimeout(() => {
              router.push(`/`);
            }, 1000);
          },
          onError: () => {
            toast.error(`Error verifying email: ${"Invalid or expired OTP"}`);
          },
        },
      });
    });
  }

  return (
    <Card className={"w-full mx-auto"}>
      <CardHeader className={"text-center"}>
        <CardTitle>Please check your email</CardTitle>
        <CardDescription>
          We have sent a verification code to your provided email address please
          check your Inbox
        </CardDescription>
      </CardHeader>
      <CardContent className={"items-center flex flex-col space-y-6"}>
        <div className={" space-y-2 items-center"}>
          <InputOTP
            maxLength={6}
            value={Otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p className={"text-center text-muted-foreground"}>
            Please verify your code here!
          </p>
        </div>

        <div>
          <Button
            onClick={VerifyCode}
            disabled={emailPending || !isOtpCompleted}
          >
            {emailPending ? (
              <>
                <Loader2 className={"animate-spin size-4"} />
                Verifying the Otp
              </>
            ) : (
              <>Verify your Account</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
