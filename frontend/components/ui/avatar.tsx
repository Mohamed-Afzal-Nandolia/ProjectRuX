import type * as React from "react"

export function Avatar({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`relative inline-flex h-10 w-10 overflow-hidden rounded-full bg-muted ${className}`}
    >
      {children}
    </div>
  )
}

export function AvatarImage({
  src,
  alt = "",
  className = "",
}: {
  src?: string
  alt?: string
  className?: string
}) {
  if (!src) return null
  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
    />
  )
}

export function AvatarFallback({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground ${className}`}
    >
      {children}
    </span>
  )
}
