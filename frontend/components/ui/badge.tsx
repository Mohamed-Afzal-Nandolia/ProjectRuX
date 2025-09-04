import type * as React from "react"

export function Badge({
  children,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "secondary" | "outline"
}) {
  const base = "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
  const styles = {
    default: "bg-primary/10 text-primary",
    secondary: "bg-muted text-foreground",
    outline: "border border-border text-foreground",
  } as const
  return <span className={`${base} ${styles[variant]} ${className}`}>{children}</span>
}
