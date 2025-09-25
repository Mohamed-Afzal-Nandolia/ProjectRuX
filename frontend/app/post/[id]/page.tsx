"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/seperator";
import { ArrowLeft, User, MapPin, Clock, Users } from "lucide-react";
import { getPostById, getUserProfile } from "@/services/api";
import { ApplyDialog } from "@/components/apply-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import type { Post } from "@/types/post";
import type { JwtPayload } from "@/utils/jwt";

// Helper to convert enum-like UPPER_CASE to Title Case
const formatEnumLabel = (str: string) =>
  str
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function PostDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string;
    email: string;
  } | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  // Decode token and set current user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setCurrentUser({
          id: decoded.sub,
          username: decoded.username,
          email: decoded.email,
        });
      } else {
        console.warn("Token expired");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }, []);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch post details
        const postRes = await getPostById(postId, {});
        const apiPost = postRes?.data;

        if (!apiPost) {
          setError("Post not found");
          return;
        }

        // Fetch creator username
        let creatorUsername = "Anonymous";
        try {
          if (apiPost.createdBy) {
            const userRes = await getUserProfile(apiPost.createdBy, {});
            creatorUsername = userRes?.data?.username || "Anonymous";
          }
        } catch (err) {
          console.error("Failed to fetch creator username", err);
        }

        // Map the post data
        const mappedPost: Post = {
          id: apiPost.id,
          title: apiPost.title,
          description: apiPost.description || "",
          techstack: apiPost.techStack?.map(formatEnumLabel) || [],
          roles:
            apiPost.rolesRequired?.map((r: any) => formatEnumLabel(r.role)) ||
            [],
          tags: apiPost.tags || [],
          status: apiPost.status || "OPEN",
          author: {
            name: creatorUsername,
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
          applicants: apiPost.applicants || [],
        };

        setPost(mappedPost);

        // Check if current user has already applied
        if (currentUser && apiPost.applicants) {
          const hasUserApplied = apiPost.applicants.some(
            (applicant: any) => applicant.userId === currentUser.id
          );
          setHasApplied(hasUserApplied);
        }
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError(err?.response?.data?.message || "Failed to load post");
        toast.error("Failed to load post details");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The post you're looking for doesn't exist."}
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>
        </div>

        {/* Post Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={post.status === "OPEN" ? "default" : "secondary"}
                  className={
                    post.status === "OPEN"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }
                >
                  {post.status}
                </Badge>
                {post.status === "OPEN" && currentUser && (
                  <>
                    {hasApplied ? (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        Already Applied
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => setApplyDialogOpen(true)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Apply Now
                      </Button>
                    )}
                  </>
                )}
                {post.status === "OPEN" && !currentUser && (
                  <Button
                    onClick={() => router.push("/login")}
                    variant="outline"
                  >
                    Login to Apply
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">About this project</h3>
              <p className="text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            </div>

            <Separator />

            {/* Tech Stack */}
            {post.techstack && post.techstack.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {post.techstack.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="rounded-full"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Roles Required */}
            {post.rolesRequired && post.rolesRequired.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Roles Needed</h3>
                <div className="space-y-3">
                  {post.rolesRequired.map((role, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-muted/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{role.role}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {role.openings}{" "}
                          {role.openings === 1 ? "opening" : "openings"}
                        </div>
                      </div>
                      {role.requiredSkills &&
                        role.requiredSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {role.requiredSkills.map((skill, skillIndex) => (
                              <Badge
                                key={skillIndex}
                                variant="outline"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Apply Dialog */}
        {applyDialogOpen && (
          <ApplyDialog
            post={post}
            open={applyDialogOpen}
            onOpenChange={(open) => {
              setApplyDialogOpen(open);
              // Refresh the post data when dialog closes to check if user applied
              if (!open && currentUser) {
                // Re-fetch post to get updated applicants list
                const refreshPost = async () => {
                  try {
                    const postRes = await getPostById(postId, {});
                    const apiPost = postRes?.data;
                    if (apiPost?.applicants) {
                      const hasUserApplied = apiPost.applicants.some(
                        (applicant: any) => applicant.userId === currentUser.id
                      );
                      setHasApplied(hasUserApplied);
                    }
                  } catch (err) {
                    console.error("Failed to refresh post data", err);
                  }
                };
                refreshPost();
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
