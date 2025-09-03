"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { OTPInput } from "./otp-input"

type OtpCardProps = {
  email?: string
  length?: number
  title?: string
  description?: string
  defaultValue?: string
  className?: string
  onVerify?: (code: string) => Promise<void> | void
  onResend?: () => Promise<void> | void
}

export function OtpCard({
  email,
  length = 6,
  title = "Verify your email",
  description = "Enter the 6-digit code we just sent.",
  defaultValue = "",
  className,
  onVerify,
  onResend,
}: OtpCardProps) {
  const [code, setCode] = React.useState<string>(defaultValue.slice(0, length))
  const [submitting, setSubmitting] = React.useState(false)
  const [cooldown, setCooldown] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  // Cooldown timer for resend
  React.useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(id)
  }, [cooldown])

  const maskedEmail = React.useMemo(() => {
    if (!email) return ""
    const [user = "", domain = ""] = email.split("@")
    const safeUser =
      user.length > 2 ? `${user[0]}${"•".repeat(Math.max(1, user.length - 2))}${user[user.length - 1]}` : user
    return `${safeUser}@${domain}`
  }, [email])

  const handleVerify = async () => {
    if (code.replace(/\s/g, "").length !== length) return
    setSubmitting(true)
    setError(null)
    try {
      await onVerify?.(code)
    } catch (e: any) {
      setError(e?.message || "Verification failed. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    try {
      await onResend?.()
      setCooldown(30) // basic cooldown; adjust as needed
    } catch {
      // Optionally surface resend errors
    }
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle className="text-pretty">{title}</CardTitle>
        <CardDescription className="text-pretty">
          {description} {email ? <span className="font-medium text-foreground">Sent to {maskedEmail}</span> : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <OTPInput
          length={length}
          value={code}
          onChange={setCode}
          onComplete={(v) => setCode(v)}
          error={Boolean(error)}
          autoFocus
          name="otp"
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Didn{"'"}t get the code?</p>
          <button
            type="button"
            
            onClick={handleResend}
            disabled={cooldown > 0}
            className={cn(
              "underline underline-offset-4 hover:cursor-pointer",
              cooldown > 0 ? "text-muted-foreground cursor-not-allowed" : "text-foreground",
            )}
            aria-disabled={cooldown > 0}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={submitting || code.replace(/\s/g, "").length !== length}
        >
          {submitting ? "Verifying…" : "Verify"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default OtpCard
