"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Filter } from "lucide-react";
import { FilterableTagsInput } from "@/components/filterable-tags-input";
import { getAllSkills, getAllRoles } from "@/services/api";

type SearchDialogProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearch?: (filters: { roles: string[]; skills: string[] }) => void;
  currentFilters?: { roles: string[]; skills: string[] };
};

export function SearchDialog({
  children,
  open: openProp,
  onOpenChange,
  onSearch,
  currentFilters,
}: SearchDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const controlled = typeof openProp === "boolean";
  const open = controlled ? (openProp as boolean) : internalOpen;
  const setOpen = (next: boolean) => {
    if (controlled) onOpenChange?.(next);
    else setInternalOpen(next);
  };

  // form states
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);

  // dynamic options
  const [skillsOptions, setSkillsOptions] = React.useState<string[]>([]);
  const [rolesOptions, setRolesOptions] = React.useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = React.useState(false);

  // fetch skills + roles when dialog opens
  React.useEffect(() => {
    if (!open) return;

    // Sync with current filters when dialog opens
    if (currentFilters) {
      setSelectedRoles(currentFilters.roles || []);
      setSelectedSkills(currentFilters.skills || []);
    }

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
  }, [open, currentFilters]);

  const handleSearch = () => {
    onSearch?.({ roles: selectedRoles, skills: selectedSkills });
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedRoles([]);
    setSelectedSkills([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Search
          </DialogTitle>
          <DialogDescription>
            Filter projects by roles and skills to find exactly what you're
            looking for.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Roles Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Roles</Label>
            <FilterableTagsInput
              placeholder="Select roles..."
              value={selectedRoles}
              onChange={setSelectedRoles}
              options={rolesOptions}
              className="min-h-[42px]"
            />
            <p className="text-sm text-muted-foreground">
              Choose the roles you're interested in or looking for.
            </p>
          </div>

          {/* Skills Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Skills</Label>
            <FilterableTagsInput
              placeholder="Select skills..."
              value={selectedSkills}
              onChange={setSelectedSkills}
              options={skillsOptions}
              className="min-h-[42px]"
            />
            <p className="text-sm text-muted-foreground">
              Select the technologies and skills that match your interests.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={selectedRoles.length === 0 && selectedSkills.length === 0}
          >
            Clear All
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={
                selectedRoles.length === 0 && selectedSkills.length === 0
              }
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
