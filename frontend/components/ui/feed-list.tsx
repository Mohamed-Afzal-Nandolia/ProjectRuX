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
import { toast } from "sonner"; // ✅ import sonner toast

// Helper to convert enum-like UPPER_CASE to Title Case
const formatEnumLabel = (str: string) =>
  str
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

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
  };
}

export function FeedList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePost, setActivePost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAllPost({});
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
        const openPosts = postsWithNames.filter(
          (post) => post.status === "OPEN"
        );
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

    fetchPosts();
  }, []);

  return (
    <div className="space-y-4" data-tour="center-feed">
      {posts.map((post: Post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={post.author.avatarUrl || undefined}
                  alt={`${post.author.name} avatar`}
                />
                <AvatarFallback>
                  {post.author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="text-base">{post.title}</CardTitle>
                <p className="truncate text-xs text-muted-foreground">
                  {"by "}
                  {post.author.name}
                  {" \u2022 "}
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
              {post.roles && post.roles.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => {
                    setActivePost(post);
                    toast.info(`Applying to ${post.title}... ✨`); // ✅ feedback
                  }}
                  className="shrink-0 ml-auto"
                >
                  Apply
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {post.description ? (
              <p className="text-sm leading-relaxed text-pretty">
                {post.description}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              {post.techstack?.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
              {post.roles && post.roles.length > 0 && (
                <Separator orientation="vertical" className="mx-1 h-4" />
              )}
              {post.roles?.map((r) => (
                <Badge key={r}>{r}</Badge>
              ))}
              {post.tags.length > 0 && (
                <Separator orientation="vertical" className="mx-1 h-4" />
              )}
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Single ApplyDialog controlled by activePost */}
      {activePost && (
        <ApplyDialog
          post={activePost}
          open={!!activePost}
          onOpenChange={(open) => {
            if (!open) setActivePost(null);
            else toast.success("Application submitted ✅"); // ✅ success toast
          }}
        />
      )}
    </div>
  );
}
