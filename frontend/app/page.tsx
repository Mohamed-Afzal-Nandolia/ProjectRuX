"use client";

import { SidebarLeft, SidebarLeftRef } from "@/components/ui/sidebar-left";
import { SidebarRight, SidebarRightRef } from "@/components/ui/sidebar-right";
import { FeedList } from "@/components/ui/feed-list";
import { CreatePostDialog } from "@/components/ui/create-post-dialog";
import { ModernHeader } from "@/components/ui/modern-header";
import { MobileNavigation } from "@/components/ui/mobile-navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { ApplicationsList } from "@/components/applications-list";
import { MyPostsList } from "@/components/my-posts-list";
import { Plus, TrendingUp, Users, Briefcase, X } from "lucide-react";
import { getUsername, getUserEmail } from "@/utils/jwt";
import { Badge } from "@/components/ui/badge";

// 👇 import your tour provider + hook
import { AppTour } from "@/components/app-tour";
import { useTour } from "@reactour/tour";

type ActiveSection = "home" | "communities" | "posts" | "applications";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("Anonymous");
  const [userEmail, setUserEmail] = useState("");
  const sidebarRef = useRef<SidebarLeftRef>(null);
  const sidebarRightRef = useRef<SidebarRightRef>(null);
  const [feedRefresh, setFeedRefresh] = useState(0); // Trigger for FeedList refresh
  const [searchFilters, setSearchFilters] = useState<{
    roles: string[];
    skills: string[];
  }>({ roles: [], skills: [] });

  // Function to refresh stats - passed to components that need it
  const refreshStats = () => {
    if (sidebarRef.current) {
      sidebarRef.current.refreshStats();
    }
  };

  // Function to refresh platform stats
  const refreshPlatformStats = () => {
    if (sidebarRightRef.current) {
      sidebarRightRef.current.refreshPlatformStats();
    }
  };

  // Function to refresh all stats (both user and platform)
  const refreshAllStats = () => {
    refreshStats();
    refreshPlatformStats();
  };

  // Function to refresh feed after post creation
  const refreshFeed = () => {
    setFeedRefresh((prev) => prev + 1);
  };

  // Handle search filters from header
  const handleSearch = (filters: { roles: string[]; skills: string[] }) => {
    console.log("Search filters applied:", filters);
    setSearchFilters(filters);

    // Switch to home section to show search results
    if (activeSection !== "home") {
      setActiveSection("home");
    }
  };

  // Handle role filter from sidebar
  const handleRoleFilter = (role: string) => {
    console.log("Role filter from sidebar:", role);

    // Replace existing filters with the new role filter
    const newFilters = {
      roles: [role], // Only the clicked role
      skills: [], // Clear skills when filtering by role
    };
    setSearchFilters(newFilters);

    // Switch to home section to show filtered results
    if (activeSection !== "home") {
      setActiveSection("home");
    }
  };

  // Clear search filters
  const clearSearch = () => {
    setSearchFilters({ roles: [], skills: [] });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Extract user info from JWT token
      const username = getUsername();
      const email = getUserEmail();

      if (username) {
        setUserName(username);
      }
      if (email) {
        setUserEmail(email);
      }
    }
  }, []);

  const getSectionIcon = (section: ActiveSection) => {
    switch (section) {
      case "home":
        return <TrendingUp className="w-5 h-5" />;
      case "communities":
        return <Users className="w-5 h-5" />;
      case "posts":
        return <Briefcase className="w-5 h-5" />;
      case "applications":
        return <Briefcase className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getSectionTitle = (section: ActiveSection) => {
    if (
      section === "home" &&
      (searchFilters.roles.length > 0 || searchFilters.skills.length > 0)
    ) {
      return "Filtered Projects";
    }

    switch (section) {
      case "home":
        return "Discover Projects";
      case "communities":
        return "Communities";
      case "posts":
        return "My Projects";
      case "applications":
        return "Applications";
      default:
        return "Discover Projects";
    }
  };

  const getSectionDescription = (section: ActiveSection) => {
    switch (section) {
      case "home":
        return "Find amazing projects and collaborate with talented developers.";
      case "communities":
        return "Connect with like-minded developers and join communities.";
      case "posts":
        return "Manage your projects and track their progress.";
      case "applications":
        return "Monitor your applications and their status.";
      default:
        return "Find amazing projects and collaborate with talented developers.";
    }
  };

  const renderFeedContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <FeedList
            key={feedRefresh}
            onStatsRefresh={refreshAllStats}
            onPostCreated={() => {
              refreshFeed();
              refreshAllStats();
            }}
            filters={searchFilters}
          />
        );
      case "communities":
        return (
          <div className="space-y-6">
            <div className="text-center py-12 glass-card rounded-2xl border border-glass-border">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Communities Coming Soon
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're building amazing community features to help developers
                connect and collaborate.
              </p>
            </div>
          </div>
        );
      case "posts":
        return (
          <MyPostsList key={feedRefresh} onStatsRefresh={refreshAllStats} />
        );
      case "applications":
        return (
          <ApplicationsList
            key={feedRefresh}
            onStatsRefresh={refreshAllStats}
          />
        );
      default:
        return (
          <FeedList
            key={feedRefresh}
            onStatsRefresh={refreshAllStats}
            onPostCreated={() => {
              refreshFeed();
              refreshAllStats();
            }}
            filters={searchFilters}
          />
        );
    }
  };

  return (
    <AppTour>
      <div className="min-h-screen bg-background">
        {/* Modern Header */}
        <ModernHeader
          isAuthenticated={isAuthenticated}
          userName={userName}
          userEmail={userEmail}
          onSearch={handleSearch}
          currentFilters={searchFilters}
        />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 max-w-7xl pb-20 md:pb-8">
          {/* Section Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-primary/10">
                {getSectionIcon(activeSection)}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {getSectionTitle(activeSection)}
              </h1>
            </div>
            <p className="text-muted-foreground text-base sm:text-lg">
              {getSectionDescription(activeSection)}
            </p>

            {/* Active Filters Display */}
            {activeSection === "home" &&
              (searchFilters.roles.length > 0 ||
                searchFilters.skills.length > 0) && (
                <div className="mt-3 sm:mt-4 flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Active filters:
                  </span>
                  {searchFilters.roles.map((role) => (
                    <Badge
                      key={role}
                      variant="secondary"
                      className="flex items-center gap-1 text-xs"
                    >
                      <span>Role: {role}</span>
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => {
                          setSearchFilters((prev) => ({
                            ...prev,
                            roles: prev.roles.filter((r) => r !== role),
                          }));
                        }}
                      />
                    </Badge>
                  ))}
                  {searchFilters.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="flex items-center gap-1 text-xs"
                    >
                      <span>Skill: {skill}</span>
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => {
                          setSearchFilters((prev) => ({
                            ...prev,
                            skills: prev.skills.filter((s) => s !== skill),
                          }));
                        }}
                      />
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="text-xs h-6 px-2"
                  >
                    Clear all
                  </Button>
                </div>
              )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Sidebar - Hidden on mobile, collapsed on tablet */}
            <div className="hidden lg:block xl:col-span-3">
              <div className="sticky top-24">
                <SidebarLeft
                  ref={sidebarRef}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  onPostCreated={() => {
                    refreshFeed();
                    refreshAllStats();
                  }}
                />
              </div>
            </div>

            {/* Center Feed */}
            <section className="lg:col-span-6 xl:col-span-6 space-y-4 sm:space-y-6">
              {/* Quick Actions for Mobile */}
              <div className="lg:hidden">
                <CreatePostDialog
                  onPostCreated={() => {
                    refreshFeed();
                    refreshAllStats();
                  }}
                >
                  <Button className="w-full gradient-primary hover-lift text-white border-0 h-12 text-base font-medium">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Project
                  </Button>
                </CreatePostDialog>
              </div>

              {/* Feed Content */}
              <div className="space-y-4 sm:space-y-6">
                {renderFeedContent()}
              </div>
            </section>

            {/* Right Sidebar - Hidden on mobile and tablet */}
            <div className="hidden xl:block xl:col-span-3">
              <div className="sticky top-24">
                <SidebarRight
                  ref={sidebarRightRef}
                  onRoleFilter={handleRoleFilter}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNavigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onPostCreated={() => {
            refreshFeed();
            refreshAllStats();
          }}
          onSearch={handleSearch}
          currentFilters={searchFilters}
        />

        {/* Tour Button */}
      </div>
    </AppTour>
  );
}
