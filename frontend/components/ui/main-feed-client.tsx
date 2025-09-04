"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreatePostDialog, CreatePostTrigger } from "./create-post-dialog"
import { FeedList } from "./feed-list"

export default function MainFeedClient() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      {/* <CreatePostDialog open={open} onOpenChange={setOpen} onCreated={onCreated} /> */}
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12 md:gap-6">
        {/* Left sidebar */}
        <aside className="md:col-span-3">
          <nav className="flex flex-col gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <CreatePostTrigger asChild>
                  <Button>Create new post</Button>
                </CreatePostTrigger>
                <Button variant="ghost" className="justify-start">
                  Home
                </Button>
                <Button variant="ghost" className="justify-start">
                  My Posts
                </Button>
                <Button variant="ghost" className="justify-start">
                  Saved
                </Button>
              </CardContent>
            </Card>
          </nav>
        </aside>

        {/* Center feed */}
        <main className="md:col-span-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold text-balance">Community Feed</h1>
            <FeedList />
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="md:col-span-3">
          <div className="flex flex-col gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your profile</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Complete your profile to get better recommendations.
                <div className="mt-3 flex gap-2">
                  <Button size="sm">Edit profile</Button>
                  <Button size="sm" variant="outline">
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Based on your interests, follow relevant tags and roles to see more matching posts.
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}
