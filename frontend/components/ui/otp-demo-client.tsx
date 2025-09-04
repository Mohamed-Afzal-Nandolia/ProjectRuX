"use client";
import { OtpCard } from "@/components/ui/otp-card";
import { useEffect, useState } from "react";

export function OTPDemoClient() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("user-email");
      setUserEmail(storedEmail);
    }
  }, []);

  // You can lift state if you need to control the code externally.
  return (
    <div className="flex w-full flex-col items-center">
      <OtpCard
        email={userEmail}
        onVerify={async (code) => {
          // In production, verify on the server (route handler or server action)
          alert(`Verifying: ${code}`);
        }}
        onResend={async () => {
          // Call your API to resend the code
          await new Promise((r) => setTimeout(r, 600));
          alert("Code resent");
        }}
      />
    </div>
  );
}
