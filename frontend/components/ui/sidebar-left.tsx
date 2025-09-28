"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatePostDialog } from "./create-post-dialog";
import { getUserStats } from "@/services/api";
import { getUserId } from "@/utils/jwt";
import {
  Home,
  PlusSquare,
  FileText,
  Users,
  Edit,
  Sparkles,
  TrendingUp,
  Briefcase,
  Loader2,
} from "lucide-react";

interface UserStats {
  "Projects Created": number;
  "Projects Applied": number;
  "Projects Completed": number;
  "Projects Involved": number;
}

type ActiveSection = "home" | "communities" | "posts" | "applications";

interface SidebarLeftProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  onPostCreated?: () => void;
}

export interface SidebarLeftRef {
  refreshStats: () => void;
}

const navigationItems = [
  {
    id: "home" as ActiveSection,
    label: "Discover",
    icon: TrendingUp,
    description: "Find projects",
    gradient: "from-purple-500 to-blue-500",
  },
  {
    id: "communities" as ActiveSection,
    label: "Communities",
    icon: Users,
    description: "Connect with devs",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "posts" as ActiveSection,
    label: "My Projects",
    icon: Briefcase,
    description: "Your creations",
    gradient: "from-cyan-500 to-green-500",
  },
  {
    id: "applications" as ActiveSection,
    label: "Applications",
    icon: FileText,
    description: "Track progress",
    gradient: "from-green-500 to-yellow-500",
  },
];

export const SidebarLeft = forwardRef<SidebarLeftRef, SidebarLeftProps>(
  function SidebarLeft({ activeSection, setActiveSection, onPostCreated }, ref) {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    // Fetch user stats
    const fetchStats = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          setStatsLoading(false);
          return;
        }

        const response = await getUserStats(userId);
        setStats(response?.data || null);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    useEffect(() => {
      fetchStats();
    }, []);

    // Expose refresh function to parent
    useImperativeHandle(ref, () => ({
      refreshStats: fetchStats,
    }));
    return (
      <aside className="w-72 space-y-6">
        {/* Create Post Card */}
        <Card
          className="glass-card border-glass-border hover-lift"
          data-tour="left-sidebar"
        >
          <CardContent className="p-6">
            <CreatePostDialog onPostCreated={onPostCreated}>
              <Button
                className="w-full h-12 gradient-primary hover-lift text-white border-0 text-base font-medium"
                data-tour="create-post-nav"
              >
                <PlusSquare className="h-5 w-5 mr-2" />
                Create Project
              </Button>
            </CreatePostDialog>

            <div className="mt-4 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">Pro Tip</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Add detailed tech stack and role requirements to attract the
                best collaborators!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Menu */}
        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
                <Home className="w-3 h-3 text-white" />
              </div>
              Navigation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full justify-start gap-3 h-12 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                      : "hover:bg-muted/50 hover-lift"
                  }`}
                  data-tour={`${item.id}-nav`}
                >
                  {/* Background gradient for active state */}
                  {isActive && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 animate-pulse`}
                    />
                  )}

                  <div
                    className={`p-1.5 rounded-md ${
                      isActive
                        ? "bg-primary-foreground/20"
                        : "bg-gradient-to-br from-purple-500/10 to-orange-500/10 group-hover:from-purple-500/20 group-hover:to-orange-500/20"
                    } transition-all duration-300`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 text-left">
                    <div
                      className={`font-medium ${
                        isActive ? "text-primary-foreground" : ""
                      }`}
                    >
                      {item.label}
                    </div>
                    <div
                      className={`text-xs ${
                        isActive
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground group-hover:text-foreground/70"
                      } transition-colors duration-300`}
                    >
                      {item.description}
                    </div>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                  )}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="glass-card border-glass-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Your Stats
                </span>
                <span className="text-xs bg-orange-500/10 text-orange-600 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {statsLoading ? (
                  <div className="col-span-2 flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="text-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                      <div className="text-lg font-bold text-purple-600">
                        {stats?.["Projects Created"] || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                      <div className="text-lg font-bold text-orange-600">
                        {stats?.["Projects Applied"] || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Applied
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                      <div className="text-lg font-bold text-green-600">
                        {stats?.["Projects Completed"] || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Completed
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <div className="text-lg font-bold text-blue-600">
                        {stats?.["Projects Involved"] || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Involved
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    );
  }
);
