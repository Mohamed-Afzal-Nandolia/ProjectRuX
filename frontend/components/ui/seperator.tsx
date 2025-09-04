export function Separator({
  orientation = "horizontal",
  className = "",
}: {
  orientation?: "horizontal" | "vertical"
  className?: string
}) {
  const base = "bg-border"
  const size = orientation === "vertical" ? "w-px h-full" : "h-px w-full"
  return <div className={`${base} ${size} ${className}`} />
}
