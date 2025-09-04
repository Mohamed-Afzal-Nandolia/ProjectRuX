"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function SidebarRight() {
  return (
    <aside className="w-80 shrink-0">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/profile-user.svg" alt="User avatar" />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">You</p>
              <p className="text-xs text-muted-foreground">Builder • Looking for collaborators</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Suggested roles</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Frontend</Badge>
            <Badge>Backend</Badge>
            <Badge>AI/ML</Badge>
            <Badge variant="secondary">Designer</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trending tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">#open-source</Badge>
            <Badge variant="secondary">#nextjs</Badge>
            <Badge variant="secondary">#ai</Badge>
            <Badge variant="secondary">#design</Badge>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
