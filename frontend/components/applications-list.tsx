"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "@/components/ui/seperator";
import {
  Calendar,
  User,
  Briefcase,
  Code,
  Loader2,
  Clock,
  Check,
  X,
} from "lucide-react";
import { getAppliedPosts } from "@/services/api";
import { getUserId } from "@/utils/jwt";

// Match backend response more closely
interface Applicant {
  userId: string;
  roleApplied: string;
  skills: string[];
  status: string;
  applicantPitch: string;
}

interface ApplicationPost {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: any[];
  applicants: Applicant[];
}

interface ApplicationsListProps {
  onStatsRefresh?: () => void;
}

export function ApplicationsList({ onStatsRefresh }: ApplicationsListProps) {
  const [applications, setApplications] = useState<ApplicationPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getAppliedPosts(getUserId() + "", {});
      const data: ApplicationPost[] = res?.data || [];
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Briefcase className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No applications yet.</p>
        <p className="text-sm">Start applying to posts to see them here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((post) => {
        // pick the logged-in user's applicant entry
        const myApp = post.applicants.find((a) => a.userId === getUserId());

        if (!myApp) return null; // skip if no match (shouldn't happen)

        // Ensure status has a default value
        const applicationStatus = myApp.status || "PENDING";

        return (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {post.description || "No description available"}
                  </p>
                </div>
                <Badge variant="outline" className="ml-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(
                    post.createdAt[0],
                    post.createdAt[1] - 1,
                    post.createdAt[2]
                  ).toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Applied Role */}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Applied for:</span>
                <Badge>{myApp.roleApplied}</Badge>
              </div>

              {/* Application Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge
                  variant={
                    applicationStatus === "PENDING"
                      ? "secondary"
                      : applicationStatus === "ACCEPTED"
                      ? "default"
                      : "outline"
                  }
                  className={
                    applicationStatus === "PENDING"
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : applicationStatus === "ACCEPTED"
                      ? "bg-green-600 hover:bg-green-800 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white border-red-500"
                  }
                >
                  {applicationStatus === "PENDING" && (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {applicationStatus === "ACCEPTED" && (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  {applicationStatus === "REJECTED" && (
                    <X className="h-3 w-3 mr-1" />
                  )}
                  {applicationStatus}
                </Badge>
              </div>

              <Separator />

              {/* Skills */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Skills:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {myApp.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Applicant Pitch */}
              {myApp.applicantPitch && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Short Pitch:</span>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {myApp.applicantPitch}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
