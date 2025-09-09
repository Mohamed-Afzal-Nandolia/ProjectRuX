export interface Post {
  id: string;
  title: string;
  description?: string;
  techStack?: string[] | null;
  rolesRequired?: { role: string; requiredSkills: string[]; openings: number }[];
  tags: string[];
  author?: {
    name: string;
    avatarUrl?: string;
  };
  createdAt: number[];
}
