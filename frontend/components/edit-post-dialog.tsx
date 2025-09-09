"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TagsInput } from "@/components/ui//tags-input";
import { FilterableTagsInput } from "@/components/filterable-tags-input";
import { getAllSkills, getAllRoles, updatePostById } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { formatEnumLabel } from "@/components/filterable-tags-input";
import { getUserId } from "@/utils/jwt";

export type RoleRequirement = {
  role: string;
  requiredSkills: string[];
  openings: number;
  _editing?: boolean;
};

export type PostDialogProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    rolesRequired: RoleRequirement[];
  };
  onSubmitOverride?: (payload: any) => Promise<void>;
  onPostUpdated?: () => Promise<void>;
};

export function EditPostDialog({
  children,
  open: openProp,
  onOpenChange,
  initialData,
  onSubmitOverride,
  onPostUpdated,
}: PostDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const controlled = typeof openProp === "boolean";
  const open = controlled ? (openProp as boolean) : internalOpen;
  const setOpen = (next: boolean) => {
    if (controlled) onOpenChange?.(next);
    else setInternalOpen(next);
  };

  const [title, setTitle] = React.useState(initialData?.title ?? "");
  const [description, setDescription] = React.useState(
    initialData?.description ?? ""
  );
  const [rolesRequired, setRolesRequired] = React.useState<RoleRequirement[]>(
    initialData?.rolesRequired ?? []
  );
  const [tags, setTags] = React.useState<string[]>(initialData?.tags ?? []);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [skillsOptions, setSkillsOptions] = React.useState<string[]>([]);
  const [rolesOptions, setRolesOptions] = React.useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const fetchData = async () => {
      try {
        setLoadingOptions(true);
        const [skillsRes, rolesRes] = await Promise.all([
          getAllSkills({}),
          getAllRoles({}),
        ]);
        setSkillsOptions(skillsRes?.data || []);
        setRolesOptions(rolesRes?.data || []);
      } catch (err) {
        console.error("Failed to fetch options", err);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchData();
  }, [open]);

  function addRoleRequirement() {
    setRolesRequired((prev) => [
      ...prev,
      { role: "", requiredSkills: [], openings: 1, _editing: true },
    ]);
  }

  function updateRoleRequirement<T extends keyof RoleRequirement>(
    index: number,
    field: T,
    value: RoleRequirement[T]
  ) {
    setRolesRequired((prev) =>
      prev.map((rr, i) => (i === index ? { ...rr, [field]: value } : rr))
    );
  }

  function removeRoleRequirement(index: number) {
    setRolesRequired((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const t = title.trim();
    if (t.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    const payloadRoles = rolesRequired.map(({ _editing, ...rest }) => rest);

    // include post ID in payload
    const payload = {
      title: t,
      description,
      rolesRequired: payloadRoles,
      tags,
    };

    setSubmitting(true);
    try {
      if (onSubmitOverride) {
        await onSubmitOverride({ id: initialData?.id, ...payload });
      } else if (initialData?.id) {
        // ✅ pass ID as first argument, payload as second
        await updatePostById(initialData.id, payload);
      }

      if (onPostUpdated) {
        await onPostUpdated();
      }

      setOpen(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? <Button>Edit Post</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-balance">Edit Post</DialogTitle>
          <DialogDescription>
            Update your project details and roles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Roles Required</Label>
            {rolesRequired.map((rr, index) => (
              <Card key={index} className="border rounded-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {rr.role
                      ? `${formatEnumLabel(rr.role)} — ${
                          rr.requiredSkills.length > 0
                            ? rr.requiredSkills
                                .map((s) => formatEnumLabel(s))
                                .join(", ")
                            : "No skills"
                        } (${rr.openings} openings)`
                      : "New Role Requirement"}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateRoleRequirement(index, "_editing", !rr._editing)
                      }
                    >
                      {rr._editing ? "Save" : "Edit"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeRoleRequirement(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardHeader>

                <Collapsible
                  open={!!rr._editing}
                  onOpenChange={(val) =>
                    updateRoleRequirement(index, "_editing", val)
                  }
                >
                  <CollapsibleContent>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label>Role</Label>
                        <FilterableTagsInput
                          aria-label="Role"
                          value={rr.role ? [rr.role] : []}
                          onChange={(vals) =>
                            updateRoleRequirement(index, "role", vals[0] || "")
                          }
                          options={rolesOptions}
                          placeholder={
                            loadingOptions
                              ? "Loading roles..."
                              : "Type to search role"
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>Required Skills</Label>
                        <FilterableTagsInput
                          aria-label="Required skills"
                          value={rr.requiredSkills}
                          onChange={(vals) =>
                            updateRoleRequirement(index, "requiredSkills", vals)
                          }
                          options={skillsOptions}
                          placeholder={
                            loadingOptions
                              ? "Loading skills..."
                              : "Type to search skills"
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>Openings</Label>
                        <Input
                          type="number"
                          min={1}
                          value={rr.openings}
                          onChange={(e) =>
                            updateRoleRequirement(
                              index,
                              "openings",
                              parseInt(e.target.value) || 1
                            )
                          }
                        />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addRoleRequirement}
            >
              + Add Role
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagsInput
              value={tags}
              onChange={setTags}
              placeholder="Add tags (Enter), e.g., OSS"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Updating…" : "Update Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { DialogTrigger as EditPostTrigger };
