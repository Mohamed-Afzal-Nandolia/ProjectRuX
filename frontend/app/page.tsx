"use client";

import { SidebarLeft } from "@/components/ui/sidebar-left";
import { SidebarRight } from "@/components/ui/sidebar-right";
import { FeedList } from "@/components/ui/feed-list";
import { CreatePostDialog } from "@/components/ui/create-post-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ApplicationsList } from "@/components/applications-list";
import { MyPostsList } from "@/components/my-posts-list";

// 👇 import your tour provider + hook
import { AppTour } from "@/components/app-tour";
import { useTour } from "@reactour/tour";

type ActiveSection = "home" | "communities" | "posts" | "applications";

function TourButton() {
  const { setIsOpen } = useTour();
  return (
    <Button
      className="fixed bottom-4 right-4 shadow-lg z-[9999]"
      onClick={() => setIsOpen(true)}
    >
      Take Tour
    </Button>
  );
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");

  const renderFeedContent = () => {
    switch (activeSection) {
      case "home":
        return <FeedList />;
      case "communities":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Communities</h2>
            <p className="text-muted-foreground">
              Discover and join communities of like-minded developers.
            </p>
            <div className="text-center py-8 text-muted-foreground">
              Communities feature coming soon...
            </div>
          </div>
        );
      case "posts":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">My Posts</h2>
            <p className="text-muted-foreground">
              Manage and edit your created posts.
            </p>
            <MyPostsList />
          </div>
        );
      case "applications":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">My Applications</h2>
            <p className="text-muted-foreground">
              Track your job applications and their status.
            </p>
            <ApplicationsList />
          </div>
        );
      default:
        return <FeedList />;
    }
  };

  return (
    <AppTour>
      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-balance text-2xl font-semibold">
            {activeSection === "home" && "Main Feed"}
            {activeSection === "communities" && "Communities"}
            {activeSection === "posts" && "My Posts"}
            {activeSection === "applications" && "My Applications"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {activeSection === "home" &&
              "Discover projects, collaborators, and ideas."}
            {activeSection === "communities" &&
              "Connect with developer communities."}
            {activeSection === "posts" &&
              "View and manage all your created posts."}
            {activeSection === "applications" &&
              "View and manage your job applications."}
          </p>
        </header>

        <div className="flex gap-6">
          {/* Left nav */}
          <div className="hidden lg:block">
            <SidebarLeft
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          {/* Center feed */}
          <section className="min-w-0 flex-1">
            <div className="mb-4 lg:hidden">
              <CreatePostDialog>
                <Button className="w-full">Create New Post</Button>
              </CreatePostDialog>
            </div>
            {renderFeedContent()}
          </section>

          {/* Right sidebar */}
          <div className="hidden xl:block">
            <SidebarRight />
          </div>
        </div>
      </main>

      {/* 👇 floating button always available */}
      {/* <TourButton /> */}
    </AppTour>
  );
}
