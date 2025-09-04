"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreatePostDialog } from "./create-post-dialog"
import { Home, PlusSquare, Star, Users } from "lucide-react"

export function SidebarLeft() {
  return (
    <aside className="w-64 shrink-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Menu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
          <CreatePostDialog>
            <Button className="w-full justify-start gap-2">
              <PlusSquare className="h-4 w-4" />
              Create New Post
            </Button>
          </CreatePostDialog>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Users className="h-4 w-4" />
            Communities
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Star className="h-4 w-4" />
            Favorites
          </Button>
        </CardContent>
      </Card>
    </aside>
  )
}
