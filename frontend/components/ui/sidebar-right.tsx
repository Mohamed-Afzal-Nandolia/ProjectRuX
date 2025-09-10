"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/utils/jwt";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SidebarRight() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; bio: string } | null>(
    null
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({
          username: decoded.username,
          bio: "Builder • Looking for collaborators",
        });
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }, []);

  return (
    <aside className="w-80 shrink-0">
      <div className="space-y-4">
        <Card data-tour="right-sidebar">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Your Profile</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </CardHeader>
          <Link href="/myprofile">
            <CardContent className="flex cursor-pointer items-center gap-3 transition-colors hover:bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/profile-user.svg" alt="User avatar" />
                <AvatarFallback>
                  {user?.username?.slice(0, 2).toUpperCase() || "YO"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.username || "You"}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.bio || "Builder • Looking for collaborators"}
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Suggested roles</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Frontend</Badge>
            <Badge>Backend</Badge>
            <Badge>AI/ML</Badge>
            <Badge variant="secondary">Designer</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trending tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">#open-source</Badge>
            <Badge variant="secondary">#nextjs</Badge>
            <Badge variant="secondary">#ai</Badge>
            <Badge variant="secondary">#design</Badge>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
