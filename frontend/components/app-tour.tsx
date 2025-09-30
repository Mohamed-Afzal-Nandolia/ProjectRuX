"use client";

import type React from "react";
import { TourProvider, useTour } from "@reactour/tour";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const tourSteps = [
  {
    selector: '[data-tour="left-sidebar"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Navigation Menu
        </h3>
        <p className="text-sm text-muted-foreground">
          Use this sidebar to navigate between different sections. Each section
          shows different content in the center area while keeping the layout
          intact.
        </p>
      </div>
    ),
    position: "right",
  },
  {
    selector: '[data-tour="home-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Home Feed</h3>
        <p className="text-sm text-muted-foreground">
          View all available job posts and project opportunities. You can apply
          to positions that match your skills.
        </p>
      </div>
    ),
    position: "right",
  },
  {
    selector: '[data-tour="create-post-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Create New Post
        </h3>
        <p className="text-sm text-muted-foreground">
          Click here to create a new job posting or project. You can specify
          required roles, tech stack, and other details with our smart dropdown
          filters.
        </p>
      </div>
    ),
    position: "right",
  },
  {
    selector: '[data-tour="posts-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">My Posts</h3>
        <p className="text-sm text-muted-foreground">
          View and manage all the posts you've created. You can edit, delete,
          and see who applied to your positions with their details.
        </p>
      </div>
    ),
    position: "right",
  },
  {
    selector: '[data-tour="applications-nav"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          My Applications
        </h3>
        <p className="text-sm text-muted-foreground">
          Track all the job applications you've submitted, including your
          applied roles, skills, and cover letters.
        </p>
      </div>
    ),
    position: "right",
  },
  {
    selector: '[data-tour="center-feed"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Main Content Area
        </h3>
        <p className="text-sm text-muted-foreground">
          This area dynamically changes based on your navigation selection. It
          shows job posts, your applications, or your created posts without page
          reloads.
        </p>
      </div>
    ),
    position: "left",
  },
  {
    selector: '[data-tour="right-sidebar"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Profile & Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          View your profile information and access settings. Click on your
          profile to edit your bio and skills, or use the logout button when
          needed.
        </p>
      </div>
    ),
    position: "left",
  },
];

function TourButton() {
  const { setIsOpen } = useTour();

  return (
    <Button
      variant="default"
      size="sm"
      onClick={() => setIsOpen(true)}
      className="hidden md:flex fixed bottom-6 right-6 z-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
      data-tour="tour-button"
    >
      <HelpCircle className="h-4 w-4 mr-2" />
      Take Tour
    </Button>
  );
}

interface AppTourProps {
  children: React.ReactNode;
}

export function AppTour({ children }: AppTourProps) {
  return (
    <TourProvider
      steps={tourSteps}
      defaultOpen={false}
      className="max-w-sm"
      styles={{
        popover: (base) => ({
          ...base,
          "--reactour-accent": "hsl(var(--primary))",
          borderRadius: "12px",
          backgroundColor: "white",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          padding: "20px",
          animation: "fadeIn 0.3s ease-out",
        }),
        maskArea: (base) => ({
          ...base,
          rx: "8px",
          transition: "all 0.3s ease-out",
        }),
        badge: (base) => ({
          ...base,
          position: "absolute",
          top: "12px",
          right: "12px",
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
          borderRadius: "50%",
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: "600",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }),
        controls: (base) => ({
          ...base,
          marginTop: "16px",
          gap: "8px",
        }),
        navigation: (base) => ({
          ...base,
          gap: "8px",
        }),
        button: (base) => ({
          ...base,
          borderRadius: "6px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.2s ease-out",
        }),
        dot: (base, { current, disabled }) => ({
          ...base,
          backgroundColor: current
            ? "hsl(var(--primary))"
            : disabled
            ? "hsl(var(--muted))"
            : "hsl(var(--muted-foreground))",
          width: current ? "12px" : "8px",
          height: current ? "12px" : "8px",
          borderRadius: "50%",
          transition: "all 0.2s ease-out",
        }),
        close: (base) => ({
          ...base,
          position: "absolute",
          top: "12px",
          right: "44px", // leave space so it doesn’t overlap with badge
          background: "transparent",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "hsl(var(--muted-foreground))",
        }),
      }}
      padding={{ mask: 8, popover: [12, 12] }}
      scrollSmooth
      showBadge={false}
      showCloseButton
      showNavigation
      showDots
      disableDotsNavigation={false}
      disableKeyboardNavigation={false}
      className="tour-provider"
      maskClassName="tour-mask"
      beforeClose={() => {
        console.log("[v0] Tour closed");
        return Promise.resolve();
      }}
      afterOpen={() => {
        console.log("[v0] Tour opened");
      }}
    >
      {children}
      <TourButton />
    </TourProvider>
  );
}
