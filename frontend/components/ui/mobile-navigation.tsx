"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  Briefcase,
  FileText,
  Menu,
  X,
  TrendingUp,
  Search,
} from "lucide-react";
import { SearchDialog } from "./search-dialog";

type ActiveSection = "home" | "communities" | "posts" | "applications";

interface MobileNavigationProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  onSearch?: (filters: { roles: string[]; skills: string[] }) => void;
  currentFilters?: { roles: string[]; skills: string[] };
}

const navigationItems = [
  {
    id: "home" as ActiveSection,
    label: "Discover",
    icon: TrendingUp,
    description: "Find projects",
  },
  {
    id: "communities" as ActiveSection,
    label: "Communities",
    icon: Users,
    description: "Connect",
  },
  {
    id: "posts" as ActiveSection,
    label: "My Projects",
    icon: Briefcase,
    description: "Your work",
  },
  {
    id: "applications" as ActiveSection,
    label: "Applications",
    icon: FileText,
    description: "Track progress",
  },
];

export function MobileNavigation({
  activeSection,
  setActiveSection,
  onSearch,
  currentFilters,
}: MobileNavigationProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleNavigation = (section: ActiveSection) => {
    setActiveSection(section);
    setIsDrawerOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(item.id)}
                className={`flex-1 flex flex-col items-center gap-1 h-12 rounded-lg ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Mobile Search Floating Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <SearchDialog onSearch={onSearch} currentFilters={currentFilters}>
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Search className="w-6 h-6" />
          </Button>
        </SearchDialog>
      </div>

      {/* Mobile Drawer Menu */}
      <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="fixed top-4 left-4 z-40 md:hidden bg-background/80 backdrop-blur-sm border border-border"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-80 p-0 h-full max-h-screen">
          <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full justify-start gap-3 h-12 rounded-lg ${
                      isActive
                        ? "bg-primary text-white hover:text-white"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Active Filters (if any) */}
            {currentFilters &&
              (currentFilters.roles.length > 0 ||
                currentFilters.skills.length > 0) && (
                <div className="p-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Active Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentFilters.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        Role: {role}
                      </Badge>
                    ))}
                    {currentFilters.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        Skill: {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
