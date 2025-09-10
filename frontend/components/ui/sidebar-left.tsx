"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatePostDialog } from "./create-post-dialog";
import { Home, PlusSquare, FileText, Users, Edit } from "lucide-react";

type ActiveSection = "home" | "communities" | "posts" | "applications";

interface SidebarLeftProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
}

export function SidebarLeft({
  activeSection,
  setActiveSection,
}: SidebarLeftProps) {
  return (
    <aside className="w-64 shrink-0">
      <Card data-tour="left-sidebar">
        <CardHeader>
          <CardTitle className="text-base">Menu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => setActiveSection("home")}
            className={`w-full justify-start gap-2 hover:bg-gray-200 hover:text-black ${
              activeSection === "home" ? "bg-black text-white" : ""
            }`}
            data-tour="home-nav"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>

          <CreatePostDialog>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-accent hover:text-accent-foreground"
              data-tour="create-post-nav"
            >
              <PlusSquare className="h-4 w-4" />
              Create New Post
            </Button>
          </CreatePostDialog>

          <Button
            variant="ghost"
            onClick={() => setActiveSection("communities")}
            className={`w-full justify-start gap-2 hover:bg-gray-200 hover:text-black ${
              activeSection === "communities" ? "bg-black text-white" : ""
            }`}
            data-tour="communities-nav"
          >
            <Users className="h-4 w-4" />
            Communities
          </Button>

          <Button
            variant="ghost"
            onClick={() => setActiveSection("posts")}
            className={`w-full justify-start gap-2 hover:bg-accent hover:text-accent-foreground ${
              activeSection === "posts"
                ? "bg-accent text-accent-foreground"
                : ""
            }`}
            data-tour="posts-nav"
          >
            <Edit className="h-4 w-4" />
            My Posts
          </Button>

          <Button
            variant="ghost"
            onClick={() => setActiveSection("applications")}
            className={`w-full justify-start gap-2 hover:bg-accent hover:text-accent-foreground ${
              activeSection === "applications"
                ? "bg-accent text-accent-foreground"
                : ""
            }`}
            data-tour="applications-nav"
          >
            <FileText className="h-4 w-4" />
            My Applications
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
