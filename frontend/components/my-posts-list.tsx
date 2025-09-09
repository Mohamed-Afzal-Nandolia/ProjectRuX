"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, Trash2 } from "lucide-react";
import type { Post } from "@/types/post";
import { EditPostDialog } from "./edit-post-dialog";
import { deletePostById, getUserPostById } from "@/services/api";
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

  // Fetch and map posts
  useEffect(() => {
    if (!user?.id) return;

    const fetchUserPosts = async () => {
      try {
        const res = await getUserPostById(user.id, {});
        const rawPosts = res?.data || [];

        const mappedPosts: Post[] = rawPosts.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          techstack: p.techStack || [],
          roles: (p.rolesRequired || []).map((r: any) => r.role),
          createdAt: new Date(
            p.createdAt[0],
            p.createdAt[1] - 1,
            p.createdAt[2],
            p.createdAt[3],
            p.createdAt[4],
            p.createdAt[5]
          ).toISOString(),
          updatedAt: new Date(
            p.updatedAt[0],
            p.updatedAt[1] - 1,
            p.updatedAt[2],
            p.updatedAt[3],
            p.updatedAt[4],
            p.updatedAt[5]
          ).toISOString(),
        }));

        setUserPosts(mappedPosts);
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

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handlePostUpdated = async () => {
    if (!user?.id) return;
    try {
      const res = await getUserPostById(user.id, {});
      setUserPosts(res?.data || []);
    } catch (err) {
      console.error("Failed to refresh posts", err);
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
              editingPost.rolesRequired?.map((r) => ({
                role: r.role ?? "",
                requiredSkills: r.requiredSkills ?? [],
                openings: r.openings ?? 1,
              })) ?? [],
          }}
          open={!!editingPost}
          onOpenChange={(open) => !open && setEditingPost(null)}
          onPostUpdated={handlePostUpdated}
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

                    {/* Tech Stack */}
                    {Array.isArray(post.techStack) &&
                      post.techStack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.techStack.map((tech, index) => (
                            <Badge key={index} variant="outline">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                    {/* Roles */}
                    {Array.isArray(post.rolesRequired) &&
                      post.rolesRequired.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {post.rolesRequired.map((roleObj, index) => (
                            <Badge key={index}>{roleObj.role}</Badge>
                          ))}
                        </div>
                      )}

                    <p className="mt-3 text-sm text-muted-foreground">
                      Last Updated -{" "}
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPost(post)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {/* Delete with confirmation */}
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
