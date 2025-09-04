"use client"

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"

type DialogContextValue = {
  open: boolean
  setOpen: (next: boolean) => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

export function Dialog({
  open: openProp,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const controlled = typeof openProp === "boolean"
  const open = controlled ? (openProp as boolean) : internalOpen

  const setOpen = (next: boolean) => {
    if (controlled) onOpenChange?.(next)
    else setInternalOpen(next)
  }

  const value = useMemo(() => ({ open, setOpen }), [open])

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

export function DialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const ctx = useContext(DialogContext)
  if (!ctx) return null
  const triggerProps = {
    onClick: () => ctx.setOpen(true),
  }
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { ...triggerProps })
  }
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
      {...triggerProps}
    >
      {children}
    </button>
  )
}

export function DialogContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ctx = useContext(DialogContext)
  const contentRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") ctx?.setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [ctx])

  if (!ctx || !ctx.open) return null

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) ctx.setOpen(false)
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        ref={contentRef}
        className={`relative z-10 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function DialogFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mt-6 flex items-center justify-end gap-2 ${className}`}>{children}</div>
}

export function DialogTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
}

export function DialogDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
}
