"use client";

import { SidebarLeft, SidebarLeftRef } from "@/components/ui/sidebar-left";
import { SidebarRight, SidebarRightRef } from "@/components/ui/sidebar-right";
import { FeedList } from "@/components/ui/feed-list";
import { CreatePostDialog } from "@/components/ui/create-post-dialog";
import { ModernHeader } from "@/components/ui/modern-header";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { ApplicationsList } from "@/components/applications-list";
import { MyPostsList } from "@/components/my-posts-list";
import { Plus, TrendingUp, Users, Briefcase } from "lucide-react";

// 👇 import your tour provider + hook
import { AppTour } from "@/components/app-tour";
import { useTour } from "@reactour/tour";

type ActiveSection = "home" | "communities" | "posts" | "applications";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("Anonymous");
  const sidebarRef = useRef<SidebarLeftRef>(null);
  const sidebarRightRef = useRef<SidebarRightRef>(null);
  const [feedRefresh, setFeedRefresh] = useState(0); // Trigger for FeedList refresh

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // You could decode the token to get user info
      setUserName("Developer"); // Placeholder
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
          />
        );
    }
  };

  return (
    <AppTour>
      <div className="min-h-screen bg-background">
        {/* Modern Header */}
        <ModernHeader isAuthenticated={isAuthenticated} userName={userName} />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-primary/10">
                {getSectionIcon(activeSection)}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                {getSectionTitle(activeSection)}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {getSectionDescription(activeSection)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
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
            <section className="lg:col-span-6 space-y-6">
              {/* Quick Actions for Mobile */}
              <div className="lg:hidden">
                <CreatePostDialog
                  onPostCreated={() => {
                    refreshFeed();
                    refreshAllStats();
                  }}
                >
                  <Button className="w-full gradient-primary hover-lift text-white border-0 h-12">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Project
                  </Button>
                </CreatePostDialog>
              </div>

              {/* Feed Content */}
              <div className="space-y-6">{renderFeedContent()}</div>
            </section>

            {/* Right Sidebar */}
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <SidebarRight ref={sidebarRightRef} />
              </div>
            </div>
          </div>
        </main>

        {/* Tour Button */}
      </div>
    </AppTour>
  );
}
