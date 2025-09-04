"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { validateAuthToken } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        await validateAuthToken({ token });
        if (
          pathname === "/login" ||
          pathname === "/signup" ||
          pathname === "/signup/otp"
        ) {
          setLoading(false);
          router.push("/");
        }
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Spinner size={40} />
      </div>
    );
  }

  return <>{children}</>;
}
