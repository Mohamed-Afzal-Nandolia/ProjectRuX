"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { authLogin } from "@/services/api";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await authLogin({ email, password });

      if (data?.token) {
        // Save token to localStorage
        localStorage.setItem("token", data.token);

        // Redirect to homepage
        router.push("/");
        toast.success("Welcome back! Login successful ✨");
      } else {
        setError("Invalid response from server");
        toast.error("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Try again.");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animated-bg">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">RuX</h1>
              <p className="text-sm text-muted-foreground">
                Developer Platform
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">
            Sign in to continue your development journey
          </p>
        </div>

        <Card className="glass-card border-glass-border hover-lift shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Don't have an account?{" "}
              <span
                className="font-semibold text-primary hover:text-primary/80 cursor-pointer hover:underline transition-all"
                onClick={() => router.push("/signup")}
              >
                Create one here
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-muted/30 border-2 focus:border-primary/50 transition-all duration-200"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 h-12 bg-muted/30 border-2 focus:border-primary/50 transition-all duration-200"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 gradient-primary hover-lift text-white border-0 font-medium text-base"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                  Forgot your password?
                </span>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex-col space-y-4 pt-6">
            {/* Theme Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Theme:</span>
              <ModeToggle />
            </div>
          </CardFooter>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <span className="text-primary hover:underline cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-primary hover:underline cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
