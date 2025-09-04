import type { Post } from "@/types/post"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/seperator"

// Mock data until backend is ready
const mockPosts: Post[] = [
  {
    id: "1",
    title: "Open-source resume builder with AI suggestions",
    description:
      "Looking for contributors to build a privacy-first resume builder. AI suggestions powered by local models. Seeking a UI dev and a Go backend enthusiast.",
    author: {
      name: "Alex Chen",
      // avatarUrl: null,
    },
    createdAt: new Date("2025-03-09T15:26:31").toISOString(),
    techstack: ["Next.js", "Tailwind", "Go", "SQLite"],
    roles: ["Frontend", "Backend"],
    tags: ["open-source", "privacy", "ai"],
  },
  {
    id: "2",
    title: "Realtime chat app for communities",
    description:
      "Building a simple, fast chat app for small communities. Need help with auth and moderation tools.",
    author: {
      name: "Priya N",
      // avatarUrl: null,
    },
    createdAt: new Date("2025-03-09T13:56:31").toISOString(),
    techstack: ["Next.js", "Postgres", "WebSocket"],
    roles: ["Fullstack"],
    tags: ["communities", "chat"],
  },
]

export function FeedList() {
  const data = mockPosts

  if (!data || data.length === 0) {
    return <p className="text-sm text-muted-foreground">No posts yet. Be the first to create one!</p>
  }

  return (
    <div className="space-y-4">
      {data.map((post: Post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatarUrl || undefined} alt={`${post.author.name} avatar`} />
                <AvatarFallback>{post.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
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
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {post.description ? <p className="text-sm leading-relaxed text-pretty">{post.description}</p> : null}
            <div className="flex flex-wrap items-center gap-2">
              {post.techstack.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
              {post.roles.length > 0 && <Separator orientation="vertical" className="mx-1 h-4" />}
              {post.roles.map((r) => (
                <Badge key={r}>{r}</Badge>
              ))}
              {post.tags.length > 0 && <Separator orientation="vertical" className="mx-1 h-4" />}
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
