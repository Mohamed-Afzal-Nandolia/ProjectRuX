import * as React from "react"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className = "", ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={`min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-primary ${className}`}
        {...props}
      />
    )
  },
)
