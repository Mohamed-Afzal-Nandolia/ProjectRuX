"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUsername } from "@/utils/jwt";
import { getPlatformStats } from "@/services/api";
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
} from "lucide-react";
import { useRouter } from "next/navigation";

const trendingTags = [
  { name: "open-source", count: "2.4k", trend: "+12%" },
  { name: "nextjs", count: "1.8k", trend: "+8%" },
  { name: "ai", count: "3.2k", trend: "+24%" },
  { name: "design", count: "1.1k", trend: "+5%" },
];

const suggestedRoles = [
  {
    name: "Frontend",
    icon: Code,
    color: "bg-blue-500/10 text-blue-600",
    border: "border-blue-500/20",
  },
  {
    name: "Backend",
    icon: Code,
    color: "bg-green-500/10 text-green-600",
    border: "border-green-500/20",
  },
  {
    name: "AI/ML",
    icon: Brain,
    color: "bg-purple-500/10 text-purple-600",
    border: "border-purple-500/20",
  },
  {
    name: "Designer",
    icon: Palette,
    color: "bg-pink-500/10 text-pink-600",
    border: "border-pink-500/20",
  },
];

export interface SidebarRightRef {
  refreshPlatformStats: () => void;
}

export const SidebarRight = forwardRef<SidebarRightRef, {}>(
  function SidebarRight(props, ref) {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; bio: string } | null>(
      null
    );
    const [platformStats, setPlatformStats] = useState<{
      activeProjects: number;
      developers: number;
    } | null>(null);
    const [loading, setLoading] = useState(true);

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

    // Fetch platform stats on mount
    useEffect(() => {
      fetchPlatformStats();
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
              {suggestedRoles.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.name}
                    className={`p-3 rounded-lg border ${role.color} ${role.border} hover:scale-105 transition-all duration-200 cursor-pointer group`}
                  >
                    <Icon className="w-5 h-5 mb-2" />
                    <div className="font-medium text-sm">{role.name}</div>
                    <div className="text-xs opacity-70">High demand</div>
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
