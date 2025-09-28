"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Loader2,
  Trash2,
  User,
  Code,
  MessageSquare,
  Lock,
  Unlock,
  Check,
  X,
  Clock,
  Eye,
  Mail,
  FileText,
} from "lucide-react";
import type { Post } from "@/types/post";
import { EditPostDialog } from "./edit-post-dialog";
import {
  deletePostById,
  getUserPostById,
  getUserProfile,
  updatePostStatus,
  updateApplicantStatus,
} from "@/services/api";
import { toast } from "sonner";
import { getUserId, getUsername, getUserEmail } from "@/utils/jwt";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// extend applicant type with username and email
interface Applicant {
  userId: string;
  username?: string;
  email?: string;
  roleApplied: string;
  skills: string[];
  status: string;
  applicantPitch: string;
}

interface UserProfileDetails {
  username: string;
  email: string;
  skills: string[];
  bio: string;
}

interface MyPostsListProps {
  onStatsRefresh?: () => void;
}

export function MyPostsList({ onStatsRefresh }: MyPostsListProps) {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] =
    useState<UserProfileDetails | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    username: string;
    email: string;
  } | null>(null);

  // Decode token and set user
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
                    email: profileRes?.data?.email || "",
                    status: a.status || "PENDING", // Default to PENDING if not provided
                  };
                } catch {
                  return {
                    ...a,
                    username: "Unknown",
                    email: "",
                    status: a.status || "PENDING", // Default to PENDING if not provided
                  };
                }
              })
            );

            return {
              id: p.id,
              title: p.title,
              description: p.description,
              techstack: p.techStack || [],
              rolesRequired: p.rolesRequired || [],
              status: p.status || "OPEN", // Default to OPEN if not provided
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

      // Refresh platform stats after deleting a post
      if (onStatsRefresh) {
        onStatsRefresh();
      }
    } catch (error) {
      toast.error("Error deleting post");
      console.error("[v0] Error deleting post:", error);
    }
  };

  const handleTogglePostStatus = async (
    postId: string,
    currentStatus: string
  ) => {
    try {
      const newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
      await updatePostStatus(postId, newStatus);

      // Update the local state
      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post
        )
      );

      toast.success(`Post status updated to ${newStatus}`);

      // Refresh platform stats after changing post status
      if (onStatsRefresh) {
        onStatsRefresh();
      }
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error(
        "Error updating post status. Please check if the backend is running and CORS is configured."
      );
    }
  };

  const handleUpdateApplicantStatus = async (
    postId: string,
    applicantUserId: string,
    newStatus: string
  ) => {
    try {
      // Find the applicant to get their email
      const post = userPosts.find((p) => p.id === postId);
      const applicant = post?.applicants?.find(
        (app) => app.userId === applicantUserId
      );

      if (!applicant?.email) {
        toast.error("Applicant email not found");
        return;
      }

      // Get the frontend URL from environment
      const frontendUrl =
        process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/\/$/, "") ||
        "http://localhost:3000";
      const postLink = `${frontendUrl}/post/${postId}`;
      const feedLink = `${frontendUrl}/`;

      // Create email content based on status
      let subject: string;
      let body: string;

      if (newStatus === "ACCEPTED") {
        subject = `You’re in! Join the project as a ${applicant.roleApplied} position`;
        body = `Hi ${applicant.username || "Contributor"},
Awesome news — you’ve been accepted to contribute as a ${
          applicant.roleApplied
        } on the project "${post?.title}".

This is your chance to learn new skills, collaborate with others, and build something real that you can showcase in your portfolio or resume.

The project creator will reach out with the next steps, but you can already check out the project details here: ${postLink}.

Welcome aboard — we’re excited to see what you’ll create!

Cheers,  
Team RuX`;
      } else {
        subject = `Update on your application for ${applicant.roleApplied} position`;
        body = `Hi ${applicant.username || "Contributor"},

Thanks a lot for applying to join the project "${post?.title}" as a ${
          applicant.roleApplied
        }.

This time your application wasn’t accepted, but don’t be discouraged — RuX is all about learning and exploring. Keep applying to other projects, contribute, and grow your skills. Each step adds to your experience and portfolio.

You can find more opportunities here: ${feedLink}

Keep building, keep growing — your next project is waiting! ✨

Cheers,  
Team RuX
`;
      }

      const mailData = {
        receiverMail: applicant.email,
        subject: subject,
        body: body,
      };

      await updateApplicantStatus(postId, applicantUserId, newStatus, mailData);

      // Update the local state
      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                applicants: post.applicants?.map((applicant) =>
                  applicant.userId === applicantUserId
                    ? { ...applicant, status: newStatus }
                    : applicant
                ),
              }
            : post
        )
      );

      toast.success(
        `Applicant status updated to ${newStatus} and notification email sent`
      );

      // Refresh user stats after updating applicant status
      // This updates "Projects Involved" count for affected users
      if (onStatsRefresh) {
        onStatsRefresh();
      }
    } catch (error) {
      console.error("Error updating applicant status:", error);
      toast.error(
        "Error updating applicant status. Please check your backend connection."
      );
    }
  };

  const handleViewUserProfile = async (userId: string) => {
    try {
      setProfileLoading(true);
      setProfileDialogOpen(true);

      const profileRes = await getUserProfile(userId, {});
      const profileData = profileRes?.data;

      if (profileData) {
        setSelectedUserProfile({
          username: profileData.username || "Unknown",
          email: profileData.email || "No email provided",
          skills: profileData.skills || [],
          bio: profileData.bio || "No bio available",
        });
      } else {
        toast.error("Failed to load user profile");
        setProfileDialogOpen(false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Error loading user profile");
      setProfileDialogOpen(false);
    } finally {
      setProfileLoading(false);
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
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <Badge
                        variant={
                          post.status === "OPEN" ? "default" : "secondary"
                        }
                        className={
                          post.status === "OPEN"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        }
                      >
                        {post.status || "OPEN"}
                      </Badge>
                    </div>
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
                            {/* Username and Status */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-semibold">
                                  {app.username}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleViewUserProfile(app.userId)
                                  }
                                  className="h-6 w-6 p-0 ml-2"
                                  title="View Profile"
                                >
                                  <Eye className="h-3 w-3 text-blue-600" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    app.status === "PENDING"
                                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                      : app.status === "ACCEPTED"
                                      ? "bg-green-500 hover:bg-green-600 text-white"
                                      : "bg-red-500 hover:bg-red-600 text-white border-red-500"
                                  }
                                >
                                  {app.status === "PENDING" && (
                                    <Clock className="h-3 w-3 mr-1" />
                                  )}
                                  {app.status === "ACCEPTED" && (
                                    <Check className="h-3 w-3 mr-1" />
                                  )}
                                  {app.status === "REJECTED" && (
                                    <X className="h-3 w-3 mr-1" />
                                  )}
                                  {app.status || "PENDING"}
                                </Badge>
                                {/* Status Action Buttons */}
                                {app.status !== "ACCEPTED" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateApplicantStatus(
                                        post.id,
                                        app.userId,
                                        "ACCEPTED"
                                      )
                                    }
                                    className="h-6 w-6 p-0"
                                    title="Accept Applicant"
                                  >
                                    <Check className="h-4 w-4 text-green-600" />
                                  </Button>
                                )}
                                {app.status !== "REJECTED" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateApplicantStatus(
                                        post.id,
                                        app.userId,
                                        "REJECTED"
                                      )
                                    }
                                    className="h-6 w-6 p-0"
                                    title="Reject Applicant"
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </Button>
                                )}
                              </div>
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
                      onClick={() =>
                        handleTogglePostStatus(post.id, post.status || "OPEN")
                      }
                      className="h-8 w-8 p-0"
                      title={`${
                        post.status === "OPEN" ? "Close Post" : "Open Post"
                      }`}
                    >
                      {post.status === "OPEN" ? (
                        <Unlock className="h-4 w-4 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-red-500" />
                      )}
                    </Button>

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

      {/* User Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Applicant Profile
            </DialogTitle>
            <DialogDescription>
              Contact details and information about this applicant
            </DialogDescription>
          </DialogHeader>

          {profileLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : selectedUserProfile ? (
            <div className="space-y-6">
              {/* Username */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Username</span>
                </div>
                <p className="text-sm bg-muted/30 p-3 rounded-md">
                  {selectedUserProfile.username}
                </p>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-sm bg-muted/30 p-3 rounded-md break-all">
                  {selectedUserProfile.email}
                </p>
              </div>

              {/* Skills */}
              {selectedUserProfile.skills &&
                selectedUserProfile.skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedUserProfile.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="rounded-full px-3 py-1 text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {/* Bio */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Bio</span>
                </div>
                <p className="text-sm bg-muted/30 p-3 rounded-md leading-relaxed">
                  {selectedUserProfile.bio}
                </p>
              </div>

              {/* Contact Action */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-3">
                  Use the email above to contact this applicant directly
                </p>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedUserProfile.email);
                    toast.success("Email copied to clipboard!");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Copy Email Address
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load profile information
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
