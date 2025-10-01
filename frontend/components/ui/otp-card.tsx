"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OTPInput } from "./otp-input";
import { authResendOtp, authVerifyOtp, getUserIdByEmail } from "@/services/api";
import { toast } from "sonner";

type OtpCardProps = {
  email?: string;
  length?: number;
  title?: string;
  description?: string;
  defaultValue?: string;
  className?: string;
  onVerify?: (otpCode: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
};

export function OtpCard({
  email,
  length = 6,
  title = "Verify your email",
  description = "Enter the 6-digit code we just sent.",
  defaultValue = "",
  className,
  onVerify,
  onResend,
}: OtpCardProps) {
  const router = useRouter();
  const [otpCode, setOtpCode] = React.useState<string>(
    defaultValue.slice(0, length)
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  // Cooldown timer for resend
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const maskedEmail = React.useMemo(() => {
    if (!email) return "";
    const [user = "", domain = ""] = email.split("@");
    const safeUser =
      user.length > 2
        ? `${user[0]}${"•".repeat(Math.max(1, user.length - 2))}${
            user[user.length - 1]
          }`
        : user;
    return `${safeUser}@${domain}`;
  }, [email]);

  const handleVerify = async () => {
    if (otpCode.replace(/\s/g, "").length !== length || !email) return;
    setSubmitting(true);
    setError(null);

    localStorage.setItem("otp-code", otpCode);
    try {
      // Step 1: Get userId
      const res1 = await getUserIdByEmail({ email });
      const userId = res1.data?.success; // backend returns Map.of("success", userId)
      console.log("userId: ", userId);

      if (!userId) throw new Error("User ID not found");

      // Step 2: Verify OTP with userId
      const res2 = await authVerifyOtp(userId, { otpCode });
      const token = res2.data?.token;

      if (!token) throw new Error("OTP verification failed");

      // Step 3: Store JWT
      localStorage.setItem("token", token);

      // Step 4: Redirect to homepage
      router.push("/");
      toast.success("Account verified Succesfully");
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Verification failed. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    const otp = localStorage.getItem("otp-code");
    if (cooldown > 0 || !email) return;
    try {
      // 1. get userId
      const { data: userIdResponse } = await getUserIdByEmail({ email });
      const userId = userIdResponse.success;

      // 2. resend OTP
      const res = await authResendOtp(userId, { otpCode });

      // 3. clear the input fields
      setOtpCode("");
      setError(null); // also clear any existing errors

      setCooldown(30); // start cooldown
    } catch (e: any) {
      setError(e?.message || "Resend failed. Try again.");
    }
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle className="text-pretty">{title}</CardTitle>
        <CardDescription className="text-pretty">
          {description}{" "}
          {email ? (
            <span className="font-medium text-foreground">
              Sent to {maskedEmail}
            </span>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <OTPInput
          length={length}
          value={otpCode}
          onChange={setOtpCode}
          onComplete={(v) => setOtpCode(v)}
          error={Boolean(error)}
          autoFocus
          name="otp"
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Didn{"'"}t get the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className={cn(
              "underline underline-offset-4 hover:cursor-pointer",
              cooldown > 0
                ? "text-muted-foreground cursor-not-allowed"
                : "text-foreground"
            )}
            aria-disabled={cooldown > 0}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={submitting || otpCode.replace(/\s/g, "").length !== length}
        >
          {submitting ? "Verifying…" : "Verify"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default OtpCard;
