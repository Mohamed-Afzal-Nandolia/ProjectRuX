"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/modetoggle";
import { authSignup } from "@/services/api";
import { useState } from "react";
import { AuthProvider } from "@/providers/auth-provider";
import { toast } from "sonner";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authSignup({ username, email, password });
      setLoading(false);
      localStorage.setItem("user-email", email);
      router.push("/signup/otp");

      if (res.data.error == "User Already exists") {
        toast.info(
          <div className="flex flex-col">
            <span className="font-semibold">User already exists</span>
            <span className="text-sm text-muted-foreground">
              Verify with OTP. If you didn’t receive it, you can resend it from
              the OTP page.
            </span>
          </div>
        );
      } else {
        toast.info("Verify your account");
      }
    } catch (err: any) {
      console.error("Signup Error: ", err.response?.data || err.message);
    }
  };

  return (
    <AuthProvider>
      <Card className="w-full max-w-sm">
        <CardHeader className="justify-center text-center">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <span
              className="font-semibold hover:underline cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="xyz"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="*********"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <CardFooter className="flex-col gap-2 mt-6">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
              <ModeToggle />
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </AuthProvider>
  );
}
