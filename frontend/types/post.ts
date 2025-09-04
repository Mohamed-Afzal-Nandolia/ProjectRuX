export interface Post {
  id: string
  title: string
  description?: string
  techstack: string[]
  roles: string[]
  tags: string[]
  author: {
    name: string
    avatarUrl?: string
  }
  createdAt: string // ISO string
}
