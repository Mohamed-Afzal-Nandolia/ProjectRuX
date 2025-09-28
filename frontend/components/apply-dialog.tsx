"use client";

import { useState, useEffect } from "react";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { FilterableTagsInput } from "./filterable-tags-input";
import type { Post } from "@/types/post";
import { getAllSkills, getAllRoles, applyForPosition } from "@/services/api";
import { Loader2 } from "lucide-react";
import { getUserId } from "@/utils/jwt";
import { toast } from "sonner";

interface ApplyDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplicationSuccess?: () => void; // Callback for when application is successful
}

export function ApplyDialog({
  post,
  open,
  onOpenChange,
  onApplicationSuccess,
}: ApplyDialogProps) {
  const [selectedRole, setSelectedRole] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [shortPitch, setShortPitch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userIdFromToken = getUserId();
    if (userIdFromToken) {
      setUserId(userIdFromToken);
    }
  }, []);

  // Fetch roles & skills when dialog opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [rolesRes, skillsRes] = await Promise.all([
            getAllRoles({}),
            getAllSkills({}),
          ]);
          setAllRoles(rolesRes.data || []);
          setAllSkills(skillsRes.data || []);
        } catch (err) {
          console.error("Failed to load roles/skills:", err);
          toast.error("❌ Failed to load roles/skills");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || skills.length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        userId,
        roleApplied: selectedRole,
        skills,
        applicantPitch: shortPitch,
        status: "PENDING",
      };

      await applyForPosition(post.id, payload);

      onOpenChange(false);
      setSelectedRole("");
      setSkills([]);
      setShortPitch("");

      toast.success("Application submitted successfully!");

      // Trigger stats refresh callback
      if (onApplicationSuccess) {
        onApplicationSuccess();
      }
    } catch (error) {
      console.error("Failed to submit application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl shadow-xl border p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Apply for Position
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Apply for a role in{" "}
            <span className="font-medium">"{post.title}"</span> by{" "}
            <span className="font-medium">{post.author.name}</span>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Select Role *</Label>
              <FilterableTagsInput
                value={selectedRole ? [selectedRole] : []}
                onChange={(roles) => setSelectedRole(roles[0] || "")}
                options={allRoles}
                placeholder="Search and select a role"
                aria-label="Select role"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Your Skills *</Label>
              <FilterableTagsInput
                options={allSkills}
                value={skills}
                onChange={setSkills}
                placeholder="Type to search and add your skills..."
              />
            </div>

            {/* Short Pitch */}
            <div className="space-y-2">
              <Label htmlFor="shortPitch">Short Pitch (Optional)</Label>
              <Textarea
                id="shortPitch"
                value={shortPitch}
                onChange={(e) => setShortPitch(e.target.value)}
                placeholder="Tell them why you're interested in this role..."
                rows={4}
                maxLength={250}
              />
              <DialogDescription className="text-sm text-muted-foreground">
                max 250 Characters
              </DialogDescription>
            </div>

            {/* Project Details */}
            <div className="space-y-2">
              <Label>Project Details</Label>
              <div className="rounded-md border bg-muted/50 p-4">
                <h4 className="font-medium text-sm">{post.title}</h4>
                {post.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {post.description}
                  </p>
                )}
                {post.techstack && post.techstack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      Tech Stack:
                    </span>
                    {post.techstack?.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedRole || skills.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Submit Application"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
