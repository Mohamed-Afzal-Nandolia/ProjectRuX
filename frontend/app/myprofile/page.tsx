"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import {
  getAllSkills,
  getUserProfile,
  updateUserRoleAndSkill,
  getUserPostById,
  deletePostById,
  getPostById,
  updatePostById,
} from "@/services/api";
import {
  FilterableTagsInput,
  formatEnumLabel,
} from "@/components/filterable-tags-input";
import { getUserId, getUsername, getUserEmail } from "@/utils/jwt";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/post";
import { toast } from "sonner";
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
import { EditPostDialog } from "@/components/edit-post-dialog";

export default function MyProfilePage() {
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsOptions, setSkillsOptions] = useState<string[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [user, setUser] = useState<{
    id: string;
    username: string;
    email: string;
  } | null>(null);

  const [errors, setErrors] = useState<{ bio?: string; skills?: string }>({});

  // Decode JWT and set user info
  useEffect(() => {
    const userId = getUserId();
    const username = getUsername();
    const email = getUserEmail();

    if (userId && username && email) {
      setUser({
        id: userId,
        username: username,
        email: email,
      });
    }
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await getUserProfile(user.id, {});
        const data = res?.data;
        if (data) {
          setBio(data.bio || "");
          setSkills(data.skills || []);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Fetch skills options
  useEffect(() => {
    const fetchSkillsOptions = async () => {
      try {
        setLoadingSkills(true);
        const res = await getAllSkills({});
        setSkillsOptions(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch skills", err);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchSkillsOptions();
  }, []);

  // ✅ Fetch user posts using new API
  useEffect(() => {
    if (!user?.id) return;

    const fetchUserPosts = async () => {
      try {
        const res = await getUserPostById(user.id, {});
        const posts: Post[] = res?.data || [];
        setUserPosts(posts);
      } catch (error) {
        console.error("[v0] Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  }, [user?.id]);

  const validate = () => {
    const newErrors: { bio?: string; skills?: string } = {};
    if (!bio.trim()) newErrors.bio = "Bio is required";
    if (skills.length === 0)
      newErrors.skills = "At least one skill is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !user) return;

    const payload = {
      id: user.id,
      bio,
      skills,
    };

    try {
      await updateUserRoleAndSkill(payload);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await deletePostById(postId, {});
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
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6">
      <header className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-balance text-2xl font-semibold">My Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile information
          </p>
        </div>
      </header>

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

      <div className="space-y-6">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/profile-user.svg" alt="User avatar" />
              <AvatarFallback className="text-lg">
                {user?.username?.slice(0, 2).toUpperCase() || "YO"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user?.username || "You"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground">{bio}</p>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bio</CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell others about yourself..."
                    className={cn(
                      "min-h-[100px]",
                      errors.bio && "border-red-500"
                    )}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm">{bio}</p>
            )}
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <FilterableTagsInput
                  aria-label="Skills"
                  value={skills}
                  onChange={setSkills}
                  options={skillsOptions}
                  placeholder={
                    loadingSkills
                      ? "Loading skills..."
                      : "Type to search skills"
                  }
                  className={errors.skills ? "border-red-500" : ""}
                />
                {errors.skills && (
                  <p className="text-sm text-red-500">{errors.skills}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Select your skills (Press Enter or click from dropdown)
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {formatEnumLabel(skill)}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Posts Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Posts ({userPosts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {userPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You haven't created any posts yet.
              </p>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div key={post.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {post.description}
                        </p>

                        {/* techStack may be null, so guard it */}
                        {Array.isArray(post.techStack) &&
                          post.techStack.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {post.techStack.map((tech, index) => (
                                <Badge key={index} variant="outline">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}

                        {/* rolesRequired */}
                        {Array.isArray(post.rolesRequired) &&
                          post.rolesRequired.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {post.rolesRequired.map((roleObj, index) => (
                                <Badge key={index}>{roleObj.role}</Badge>
                              ))}
                            </div>
                          )}

                        <p className="mt-2 text-xs text-muted-foreground">
                          Last Updated -{" "}
                          {post.createdAt
                            ? new Date(
                                post.createdAt[0],
                                post.createdAt[1] - 1,
                                post.createdAt[2]
                              ).toLocaleDateString()
                            : "Unknown date"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPost(post)}
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
                                This action cannot be undone. This will
                                permanently delete your post.
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
