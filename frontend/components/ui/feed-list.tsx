"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/types/post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/seperator";
import { getAllPost, getUserProfile } from "@/services/api";
import { ApplyDialog } from "@/components/apply-dialog";
import { Button } from "./button";
import { CreatePostDialog } from "./create-post-dialog";
import { toast } from "sonner";
import { Clock, Users, Star, TrendingUp } from "lucide-react";
import { getUserId, getUsername, getUserEmail } from "@/utils/jwt";

// Helper to convert enum-like UPPER_CASE to Title Case
const formatEnumLabel = (str: string) =>
  str
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// Helper to convert "Title Case" back to "UPPER_CASE" for API
const reverseEnumLabel = (str: string) =>
  str.toUpperCase().split(" ").join("_");

// Map backend data -> frontend Post type
function mapPost(apiPost: any, username?: string): Post {
  return {
    id: apiPost.id,
    title: apiPost.title,
    description: apiPost.description || "",
    techstack: apiPost.techStack?.map(formatEnumLabel) || [],
    roles:
      apiPost.rolesRequired?.map((r: any) => formatEnumLabel(r.role)) || [],
    tags: apiPost.tags || [],
    status: apiPost.status,
    author: {
      name: username || "Anonymous",
      avatarUrl: undefined,
    },
    createdAt: new Date(
      apiPost.createdAt[0],
      apiPost.createdAt[1] - 1,
      apiPost.createdAt[2],
      apiPost.createdAt[3],
      apiPost.createdAt[4],
      apiPost.createdAt[5],
      Math.floor(apiPost.createdAt[6] / 1000000)
    ).toISOString(),
    rolesRequired:
      apiPost.rolesRequired?.map((r: any) => ({
        role: formatEnumLabel(r.role),
        requiredSkills: r.requiredSkills?.map(formatEnumLabel) || [],
        openings: r.openings || 1,
      })) || [],
    applicants: apiPost.applicants || [], // Include applicants data
  };
}

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

interface FeedListProps {
  onStatsRefresh?: () => void;
  onPostCreated?: () => void;
  filters?: { roles: string[]; skills: string[] };
}

export function FeedList({
  onStatsRefresh,
  onPostCreated,
  filters,
}: FeedListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string;
    email: string;
  } | null>(null);

  // Function to fetch posts - extracted for reuse
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert filters to API format
      const apiFilters: { role?: string; skill?: string } = {};

      // Convert human-readable format back to API enum format
      if (filters?.roles && filters.roles.length > 0) {
        apiFilters.role = reverseEnumLabel(filters.roles[0]);
      }

      if (filters?.skills && filters.skills.length > 0) {
        apiFilters.skill = reverseEnumLabel(filters.skills[0]);
      }

      const res = await getAllPost(apiFilters);
      const apiPosts = res?.data || [];

      // Fetch usernames for all posts
      const postsWithNames = await Promise.all(
        apiPosts.map(async (post: any) => {
          let username = "Anonymous";
          try {
            if (post.createdBy) {
              const userRes = await getUserProfile(post.createdBy, {});
              username = userRes?.data?.username || "Anonymous";
            }
          } catch (err) {
            console.error(`Failed to fetch username for ${post.id}`, err);
          }
          return mapPost(post, username);
        })
      );

      // Filter to only show OPEN posts (hide CLOSED posts)
      const openPosts = postsWithNames.filter((post) => post.status === "OPEN");
      console.log(
        `Showing ${openPosts.length} out of ${postsWithNames.length} posts (filtered out CLOSED posts)`
      );

      setPosts(openPosts);
    } catch (err: any) {
      console.error("Failed to fetch posts", err);
      setError("Failed to load posts");
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Decode token and set current user
  useEffect(() => {
    const userId = getUserId();
    const username = getUsername();
    const email = getUserEmail();

    if (userId && username && email) {
      setCurrentUser({
        id: userId,
        username: username,
        email: email,
      });
    }
  }, []);

  // Helper function to check if user has applied
  const hasUserApplied = (post: Post): boolean => {
    if (!currentUser || !post.applicants) return false;
    return post.applicants.some(
      (applicant: any) => applicant.userId === currentUser.id
    );
  };

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6" data-tour="center-feed">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="glass-card border-glass-border animate-pulse"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="w-24 sm:w-32 h-3 sm:h-4 bg-muted rounded mb-2"></div>
                  <div className="w-32 sm:w-48 h-2 sm:h-3 bg-muted rounded"></div>
                </div>
              </div>
              <div className="w-full h-16 sm:h-20 bg-muted rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="w-12 sm:w-16 h-5 sm:h-6 bg-muted rounded"></div>
                <div className="w-16 sm:w-20 h-5 sm:h-6 bg-muted rounded"></div>
                <div className="w-10 sm:w-12 h-5 sm:h-6 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="glass-card border-glass-border p-8 rounded-2xl max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="gradient-primary hover-lift text-white border-0"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="glass-card border-glass-border p-8 rounded-2xl max-w-md mx-auto">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to share an amazing project with the community!
          </p>
          <CreatePostDialog
            onPostCreated={() => {
              fetchPosts(); // Refresh the feed
              if (onPostCreated) onPostCreated(); // Call parent callback
            }}
          >
            <Button className="gradient-primary hover-lift text-white border-0">
              Create First Project
            </Button>
          </CreatePostDialog>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6" data-tour="center-feed">
      {posts.map((post: Post) => {
        return (
          <Card
            key={post.id}
            className="glass-card border-glass-border hover-lift group overflow-hidden"
          >
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-9 w-9 sm:h-11 sm:w-11 border-2 border-purple-500/20">
                      <AvatarImage
                        src={post.author.avatarUrl || undefined}
                        alt={`${post.author.name} avatar`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-orange-500 text-white font-semibold text-xs sm:text-sm">
                        {post.author.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg font-semibold mb-1 group-hover:text-primary transition-colors truncate">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span className="font-medium text-foreground truncate">
                        by {post.author.name}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="hidden sm:inline">
                          {getTimeAgo(post.createdAt)}
                        </span>
                        <span className="sm:hidden">
                          {getTimeAgo(post.createdAt).replace(" ago", "")}
                        </span>
                      </div>
                      {post.roles && post.roles.length > 0 && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <div className="hidden sm:flex items-center gap-1 text-orange-600">
                            <Users className="w-3 h-3" />
                            <span className="text-xs">
                              {post.roles.length} roles
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Apply Button in Header - Responsive */}
                {post.roles && post.roles.length > 0 && (
                  <div className="flex-shrink-0">
                    {hasUserApplied(post) ? (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 text-xs"
                      >
                        <span className="hidden sm:inline">
                          Already Applied
                        </span>
                        <span className="sm:hidden">Applied</span>
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => {
                          setActivePost(post);
                          toast.info(`Applying to ${post.title}... ✨`);
                        }}
                        className="gradient-primary hover-lift text-white border-0 h-8 sm:h-9 px-3 sm:px-6 text-xs sm:text-sm font-medium"
                      >
                        <span className="hidden sm:inline">Apply Now</span>
                        <span className="sm:hidden">Apply</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              {post.description && (
                <p className="text-sm leading-relaxed text-foreground/80">
                  {post.description}
                </p>
              )}

              {/* Tech Stack, Roles, and Required Skills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {post.techstack?.map((tech, index) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className={`border-purple-500/30 text-purple-600 hover:bg-purple-500/10 transition-colors text-xs ${
                      index % 2 === 0
                        ? "hover:border-purple-500/50"
                        : "hover:border-orange-500/50 hover:text-orange-600"
                    }`}
                  >
                    {tech}
                  </Badge>
                ))}

                {/* Roles */}
                {post.roles && post.roles.length > 0 && (
                  <>
                    {post.techstack && post.techstack.length > 0 && (
                      <Separator
                        orientation="vertical"
                        className="mx-1 h-3 sm:h-4"
                      />
                    )}
                    {post.roles?.map((role, index) => (
                      <Badge
                        key={role}
                        className={`text-xs ${
                          index % 2 === 0
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                            : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                        } hover:scale-105 transition-all`}
                      >
                        {role}
                      </Badge>
                    ))}
                  </>
                )}

                {/* Required Skills from Role Requirements */}
                {post.rolesRequired && post.rolesRequired.length > 0 && (
                  <>
                    {(post.techstack && post.techstack.length > 0) ||
                    (post.roles && post.roles.length > 0) ? (
                      <Separator
                        orientation="vertical"
                        className="mx-1 h-3 sm:h-4"
                      />
                    ) : null}
                    {post.rolesRequired.map((roleReq, roleIndex) =>
                      roleReq.requiredSkills?.map((skill, skillIndex) => (
                        <Badge
                          key={`${roleReq.role}-${skill}-${skillIndex}`}
                          className={`text-xs ${
                            (roleIndex + skillIndex) % 2 === 0
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                          } hover:scale-105 transition-all`}
                        >
                          {skill}
                        </Badge>
                      ))
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Single ApplyDialog controlled by activePost */}
      {activePost && (
        <ApplyDialog
          post={activePost}
          open={!!activePost}
          onOpenChange={(open) => {
            if (!open) {
              setActivePost(null);
              // Refresh stats when application dialog closes
              if (onStatsRefresh) {
                onStatsRefresh();
              }
            }
          }}
          onApplicationSuccess={() => {
            // Refresh stats
            if (onStatsRefresh) {
              onStatsRefresh();
            }
            // Refresh posts to update application status
            fetchPosts();
          }}
        />
      )}
    </div>
  );
}
