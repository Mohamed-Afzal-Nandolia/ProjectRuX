"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, Trash2, User, Code, MessageSquare } from "lucide-react";
import type { Post } from "@/types/post";
import { EditPostDialog } from "./edit-post-dialog";
import {
  deletePostById,
  getUserPostById,
  getUserProfile,
} from "@/services/api";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/utils/jwt";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// extend applicant type with username
interface Applicant {
  userId: string;
  username?: string;
  roleApplied: string;
  skills: string[];
  status: string;
  applicantPitch: string;
}

export function MyPostsList() {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    username: string;
    email: string;
  } | null>(null);

  // Decode token and set user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({
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

  // Fetch posts with applicants
  useEffect(() => {
    if (!user?.id) return;

    const fetchUserPosts = async () => {
      try {
        const res = await getUserPostById(user.id, {});
        const rawPosts = res?.data || [];

        // resolve usernames for applicants
        const postsWithApplicants = await Promise.all(
          rawPosts.map(async (p: any) => {
            const applicants: Applicant[] = await Promise.all(
              (p.applicants || []).map(async (a: any) => {
                try {
                  const profileRes = await getUserProfile(a.userId, {});
                  return {
                    ...a,
                    username: profileRes?.data?.username || "Unknown",
                  };
                } catch {
                  return { ...a, username: "Unknown" };
                }
              })
            );

            return {
              id: p.id,
              title: p.title,
              description: p.description,
              techstack: p.techStack || [],
              rolesRequired: p.rolesRequired || [],
              createdAt: new Date(
                p.createdAt[0],
                p.createdAt[1] - 1,
                p.createdAt[2]
              ).toISOString(),
              updatedAt: new Date(
                p.updatedAt[0],
                p.updatedAt[1] - 1,
                p.updatedAt[2]
              ).toISOString(),
              applicants,
            };
          })
        );

        setUserPosts(postsWithApplicants);
      } catch (error) {
        console.error("[v0] Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user?.id]);

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePostById(postId, {});
      toast.success("Post deleted successfully");
      setUserPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );
    } catch (error) {
      toast.error("Error deleting post");
      console.error("[v0] Error deleting post:", error);
    }
  };

  if (loading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <>
      {editingPost && (
        <EditPostDialog
          initialData={{
            id: editingPost.id,
            title: editingPost.title ?? "",
            description: editingPost.description ?? "",
            tags: editingPost.tags ?? [],
            rolesRequired:
              editingPost.rolesRequired?.map((r: any) => ({
                role: r.role ?? "",
                requiredSkills: r.requiredSkills ?? [],
                openings: r.openings ?? 1,
              })) ?? [],
          }}
          open={!!editingPost}
          onOpenChange={(open) => !open && setEditingPost(null)}
        />
      )}

      {userPosts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          You haven’t created any posts yet. Click "Create New Post" to get
          started!
        </div>
      ) : (
        <div className="space-y-4">
          {userPosts.map((post) => (
            <Card key={post.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {post.description}
                    </p>

                    {/* Applicants */}
                    {post.applicants && post.applicants.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <p className="font-medium text-sm">Applicants:</p>
                        {post.applicants.map((app, idx) => (
                          <div
                            key={idx}
                            className="border rounded-xl p-4 bg-muted/30 space-y-3 shadow-sm"
                          >
                            {/* Username */}
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-semibold">
                                {app.username}
                              </span>
                            </div>

                            {/* Role Applied */}
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="px-2 py-1 text-xs"
                              >
                                {app.roleApplied}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                applied role
                              </span>
                            </div>

                            {/* Divider before skills */}
                            <div className="border-t pt-3" />

                            {/* Skills */}
                            {app.skills?.length > 0 && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Code className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    Skills:
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {app.skills.map((skill, i) => (
                                    <Badge
                                      key={i}
                                      variant="secondary"
                                      className="rounded-full px-3 py-1 text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Divider before pitch */}
                            {app.applicantPitch && (
                              <div className="border-t pt-3" />
                            )}

                            {/* Pitch */}
                            {app.applicantPitch && (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    Pitch:
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground bg-background/60 p-3 rounded-md">
                                  {app.applicantPitch}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingPost(post)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The post will be
                            permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
