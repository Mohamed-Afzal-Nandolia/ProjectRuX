import { OTPDemoClient } from "@/components/ui/otp-demo-client";

export default function OTPDemoPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-8 p-6">
      <header className="w-full">
        <h1 className="text-balance text-2xl font-semibold">
          Enter Verification Code
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          We sent a 6-digit code to your email. Enter it below to continue.
        </p>
      </header>

      <OTPDemoClient />
    </main>
  );
}
