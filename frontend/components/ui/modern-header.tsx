"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/modetoggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ModernHeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  userAvatar?: string;
}

export function ModernHeader({
  isAuthenticated = false,
  userName = "User",
  userAvatar,
}: ModernHeaderProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logged out successfully");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "glass-card shadow-lg backdrop-blur-xl"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1
              className="text-xl font-bold gradient-text cursor-pointer"
              onClick={() => router.push("/")}
            >
              RuX
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Developer Platform
            </p>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects, skills, developers..."
              className="w-full pl-10 pr-4 h-10 bg-muted/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative hover-glow">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 h-10 px-3 hover-glow"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="bg-gradient-primary text-white text-sm">
                        {userName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 glass-card border-glass-border"
                  align="end"
                  forceMount
                >
                  <div className="flex items-center justify-start gap-3 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {userName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none min-w-0 flex-1">
                      <p className="font-medium truncate">{userName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        developer@rux.platform
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/myprofile")}
                    className="cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                className="hover-glow"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/signup")}
                className="gradient-primary hover-lift text-white border-0"
              >
                Get Started
              </Button>
            </>
          )}

          {/* Theme Toggle */}
          <ModeToggle />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 h-9 bg-muted/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
        </div>
      </div>
    </header>
  );
}
