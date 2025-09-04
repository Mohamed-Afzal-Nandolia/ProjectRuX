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

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await authSignup({
        username,
        email,
        password,
      });

      console.log("Signup success: ", res.data);
      router.push("/signup/otp");
    } catch (err: any) {
      console.error("Signup Error: ", err.response?.data || err.message);
    }
  };

  return (
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
            <Button type="submit" className="w-full cursor-pointer">
              Sign Up
            </Button>
            <ModeToggle />
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
