"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUsername } from "@/utils/jwt";
import { getPlatformStats, getAllRoles } from "@/services/api";
import {
  TrendingUp,
  Users,
  Star,
  Calendar,
  ExternalLink,
  Code,
  Palette,
  Brain,
  Sparkles,
  Trophy,
  Target,
  Monitor,
  Server,
  Smartphone,
  Settings,
  Database,
  TestTube,
} from "lucide-react";
import { useRouter } from "next/navigation";

const trendingTags = [
  { name: "open-source", count: "2.4k", trend: "+12%" },
  { name: "nextjs", count: "1.8k", trend: "+8%" },
  { name: "ai", count: "3.2k", trend: "+24%" },
  { name: "design", count: "1.1k", trend: "+5%" },
];

// Helper function to map role names to icons and colors (following 2-3 color preference)
const getRoleDisplayInfo = (roleName: string) => {
  const role = roleName.toLowerCase();

  if (role.includes("frontend") || role.includes("ui")) {
    return {
      icon: Monitor,
      color: "bg-purple-500/10 text-purple-600",
      border: "border-purple-500/20",
    };
  }

  if (role.includes("backend") || role.includes("server")) {
    return {
      icon: Server,
      color: "bg-orange-500/10 text-orange-600",
      border: "border-orange-500/20",
    };
  }

  if (role.includes("fullstack") || role.includes("full")) {
    return {
      icon: Code,
      color: "bg-purple-500/10 text-purple-600",
      border: "border-purple-500/20",
    };
  }

  if (role.includes("mobile") || role.includes("app")) {
    return {
      icon: Smartphone,
      color: "bg-orange-500/10 text-orange-600",
      border: "border-orange-500/20",
    };
  }

  if (role.includes("devops") || role.includes("ops")) {
    return {
      icon: Settings,
      color: "bg-purple-500/10 text-purple-600",
      border: "border-purple-500/20",
    };
  }

  if (role.includes("data") || role.includes("engineer")) {
    return {
      icon: Database,
      color: "bg-orange-500/10 text-orange-600",
      border: "border-orange-500/20",
    };
  }

  if (role.includes("ai") || role.includes("ml") || role.includes("machine")) {
    return {
      icon: Brain,
      color: "bg-purple-500/10 text-purple-600",
      border: "border-purple-500/20",
    };
  }

  if (role.includes("ux") || role.includes("design")) {
    return {
      icon: Palette,
      color: "bg-orange-500/10 text-orange-600",
      border: "border-orange-500/20",
    };
  }

  if (role.includes("qa") || role.includes("test")) {
    return {
      icon: TestTube,
      color: "bg-purple-500/10 text-purple-600",
      border: "border-purple-500/20",
    };
  }

  if (role.includes("product") || role.includes("manager")) {
    return {
      icon: Target,
      color: "bg-orange-500/10 text-orange-600",
      border: "border-orange-500/20",
    };
  }

  // Default fallback
  return {
    icon: Code,
    color: "bg-purple-500/10 text-purple-600",
    border: "border-purple-500/20",
  };
};

export interface SidebarRightRef {
  refreshPlatformStats: () => void;
}

interface SidebarRightProps {
  onRoleFilter?: (role: string) => void;
}

export const SidebarRight = forwardRef<SidebarRightRef, SidebarRightProps>(
  function SidebarRight({ onRoleFilter }, ref) {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; bio: string } | null>(
      null
    );
    const [platformStats, setPlatformStats] = useState<{
      activeProjects: number;
      developers: number;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<string[]>([]);
    const [rolesLoading, setRolesLoading] = useState(true);

    // Helper function to format numbers
    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "k";
      }
      return num.toString();
    };

    useEffect(() => {
      const username = getUsername();

      if (username) {
        setUser({
          username: username,
          bio: "Building the future • Open to collaborate",
        });
      }
    }, []);

    // Fetch platform stats function
    const fetchPlatformStats = async () => {
      try {
        setLoading(true);
        const response = await getPlatformStats();
        const stats = response.data;

        // The API returns List<Map<String, Integer>>
        // We need to parse it to get activeProjects and developers
        let activeProjects = 0;
        let developers = 0;

        if (Array.isArray(stats)) {
          stats.forEach((statMap: any) => {
            if (statMap.activeProjects !== undefined) {
              activeProjects = statMap.activeProjects;
            }
            if (statMap.developers !== undefined) {
              developers = statMap.developers;
            }
          });
        }

        setPlatformStats({
          activeProjects,
          developers,
        });
      } catch (error) {
        console.error("Failed to fetch platform stats:", error);
        // Set default values on error
        setPlatformStats({
          activeProjects: 0,
          developers: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    // Fetch roles function
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await getAllRoles({});
        const rolesData = response?.data || [];

        // Format enum labels and take first 4 for display
        const formattedRoles = rolesData
          .map((role: string) =>
            role
              .toLowerCase()
              .split("_")
              .map(
                (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(" ")
          )
          .slice(0, 4); // Show only first 4 roles in grid

        setRoles(formattedRoles);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        // Set default roles on error
        setRoles(["Frontend", "Backend", "Full Stack", "Designer"]);
      } finally {
        setRolesLoading(false);
      }
    };

    // Fetch platform stats on mount
    useEffect(() => {
      fetchPlatformStats();
      fetchRoles();
    }, []);

    // Expose refresh function to parent
    useImperativeHandle(ref, () => ({
      refreshPlatformStats: fetchPlatformStats,
    }));

    return (
      <aside className="w-80 max-w-80 space-y-6 overflow-hidden">
        {/* Profile Card */}
        <Card
          className="glass-card border-glass-border hover-lift"
          data-tour="right-sidebar"
        >
          <Link href="/myprofile">
            <CardContent className="cursor-pointer hover:bg-muted/30 p-4 rounded-xl transition-all duration-300 overflow-hidden">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-10 w-10 border-2 border-gradient-primary">
                    <AvatarImage src="/profile-user.svg" alt="User avatar" />
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                      {user?.username?.slice(0, 2).toUpperCase() || "YO"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {user?.username || "Developer"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.bio || "Building amazing projects"}
                  </p>
                </div>
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Trending Topics */}
        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              Trending Now
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingTags.map((tag, index) => (
              <div
                key={tag.name}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="font-medium text-sm group-hover:text-primary transition-colors">
                      #{tag.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tag.count} projects
                    </div>
                  </div>
                </div>
                <div className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                  {tag.trend}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested Roles */}
        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                <Users className="w-3 h-3 text-white" />
              </div>
              Popular Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {rolesLoading
                ? // Loading state
                  [...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border bg-muted/30 animate-pulse"
                    >
                      <div className="w-5 h-5 bg-muted rounded mb-2"></div>
                      <div className="w-16 h-4 bg-muted rounded mb-1"></div>
                      <div className="w-20 h-3 bg-muted rounded"></div>
                    </div>
                  ))
                : roles.map((roleName, index) => {
                    const roleInfo = getRoleDisplayInfo(roleName);
                    const Icon = roleInfo.icon;
                    return (
                      <div
                        key={roleName}
                        onClick={() => {
                          console.log("🎯 Role clicked:", roleName);
                          if (onRoleFilter) {
                            onRoleFilter(roleName);
                          }
                        }}
                        className={`p-3 rounded-lg border ${roleInfo.color} ${roleInfo.border} hover:scale-105 transition-all duration-200 cursor-pointer group hover:shadow-md`}
                      >
                        <Icon className="w-5 h-5 mb-2" />
                        <div className="font-medium text-sm">{roleName}</div>
                        <div className="text-xs opacity-70">
                          Click to filter
                        </div>
                      </div>
                    );
                  })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              Platform Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                <div className="text-2xl font-bold text-purple-600">
                  {loading
                    ? "..."
                    : formatNumber(platformStats?.activeProjects || 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Active Projects
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                <div className="text-2xl font-bold text-orange-600">
                  {loading
                    ? "..."
                    : formatNumber(platformStats?.developers || 0)}
                </div>
                <div className="text-xs text-muted-foreground">Developers</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/5 to-orange-500/5 border border-purple-500/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Weekly Activity</span>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex gap-1">
                {[40, 65, 30, 80, 55, 75, 60].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-orange-500 rounded-sm opacity-70"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    );
  }
);
