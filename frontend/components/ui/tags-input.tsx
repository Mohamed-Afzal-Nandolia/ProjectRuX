"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type TagsInputProps = {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  className?: string
  "aria-label"?: string
}

export function TagsInput({
  value,
  onChange,
  placeholder = "Add and press Enter",
  className,
  ...rest
}: TagsInputProps) {
  const [input, setInput] = React.useState("")

  function addTag(raw: string) {
    const tag = raw.trim()
    if (!tag) return
    if (value.includes(tag)) return
    onChange([...value, tag])
    setInput("")
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(input)
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border bg-background px-3 py-2",
        className,
      )}
    >
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1">
          <span>{tag}</span>
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => removeTag(tag)}
            className="rounded-sm p-0.5 hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </Badge>
      ))}
      <Input
        {...rest}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="m-0 h-6 flex-1 border-0 p-0 focus-visible:ring-0"
      />
    </div>
  )
}
