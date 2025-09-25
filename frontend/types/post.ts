export interface Post {
  id: string;
  title: string;
  description?: string;
  techstack?: string[];
  roles?: string[];
  tags: string[];
  status?: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  rolesRequired?: { role: string; requiredSkills: string[]; openings: number }[];
  applicants?: {
    userId: string;
    username?: string;
    email?: string;
    roleApplied: string;
    skills: string[];
    status: string;
    applicantPitch: string;
  }[];
}
