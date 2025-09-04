"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { TagsInput } from "./tags-input"

type CreatePostDialogProps = {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreatePostDialog({ children, open: openProp, onOpenChange }: CreatePostDialogProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const controlled = typeof openProp === "boolean"
  const open = controlled ? (openProp as boolean) : internalOpen
  const setOpen = (next: boolean) => {
    if (controlled) onOpenChange?.(next)
    else setInternalOpen(next)
  }
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [techstack, setTechstack] = React.useState<string[]>([])
  const [roles, setRoles] = React.useState<string[]>([])
  const [tags, setTags] = React.useState<string[]>([])
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const t = title.trim()
    if (t.length < 3) {
      setError("Title must be at least 3 characters")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: t,
          description,
          techstack,
          roles,
          tags,
        }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to create post")
      }

      router.refresh()

      setTitle("")
      setDescription("")
      setTechstack([])
      setRoles([])
      setTags([])
      setOpen(false)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children ?? <Button>Create New Post</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-balance">Create a new post</DialogTitle>
          <DialogDescription>Share what you are building and find collaborators.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Building an open-source AI email app"
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
              placeholder="Describe your project, goals, and what you’re looking for."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Tech stack</Label>
            <TagsInput
              aria-label="Tech stack"
              value={techstack}
              onChange={setTechstack}
              placeholder="Add tech (Enter), e.g., Next.js"
            />
          </div>

          <div className="space-y-2">
            <Label>Roles required</Label>
            <TagsInput
              aria-label="Roles required"
              value={roles}
              onChange={setRoles}
              placeholder="Add roles (Enter), e.g., Backend"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagsInput aria-label="Tags" value={tags} onChange={setTags} placeholder="Add tags (Enter), e.g., OSS" />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting…" : "Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { DialogTrigger as CreatePostTrigger }
