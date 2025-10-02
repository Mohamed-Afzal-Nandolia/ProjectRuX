"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type OTPInputProps = {
  length?: number;
  value?: string;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string; // exposes aggregated value via hidden input when used in forms
  error?: boolean;
};

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  autoFocus,
  disabled,
  className,
  name,
  error,
}: OTPInputProps) {
  const isControlled = typeof value === "string";
  const [internalDigits, setInternalDigits] = React.useState<string[]>(
    Array.from({ length }, () => "")
  );
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  const digits = isControlled
    ? Array.from({ length }, (_, i) => value?.[i] ?? "")
    : internalDigits;

  // Sync internal state when length changes (uncontrolled mode)
  React.useEffect(() => {
    if (!isControlled) {
      setInternalDigits((prev) => {
        const next = Array.from({ length }, (_, i) => prev[i] ?? "");
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length]);

  React.useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0]?.focus();
      inputsRef.current[0]?.select();
    }
  }, [autoFocus]);

  const setDigits = (next: string[]) => {
    if (!isControlled) setInternalDigits(next);
    const code = next.join("");
    onChange?.(code);
    if (next.every((d) => d !== "") && next.length === length) {
      onComplete?.(code);
    }
  };

  const focusIndex = (idx: number) => {
    const el = inputsRef.current[idx];
    if (!el) return;
    el.focus();
    try {
      const len = el.value.length;
      el.setSelectionRange(len, len);
    } catch {}
  };

  const handleChange = (idx: number, raw: string) => {
    if (disabled) return;
    const onlyDigits = raw.replace(/\D/g, "");
    if (onlyDigits.length === 0) {
      const next = [...digits];
      next[idx] = "";
      setDigits(next);
      return;
    }

    if (onlyDigits.length === 1) {
      const next = [...digits];
      next[idx] = onlyDigits;
      setDigits(next);
      if (idx < length - 1) focusIndex(idx + 1);
      return;
    }

    // Distribute multiple characters (paste/autofill into one box)
    const next = [...digits];
    let writeIndex = idx;
    for (const ch of onlyDigits) {
      if (writeIndex >= length) break;
      next[writeIndex] = ch;
      writeIndex++;
    }
    setDigits(next);
    focusIndex(Math.min(writeIndex, length - 1));
  };

  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (disabled) return;

    switch (e.key) {
      case "Backspace": {
        if (digits[idx]) {
          const next = [...digits];
          next[idx] = "";
          setDigits(next);
        } else if (idx > 0) {
          e.preventDefault();
          focusIndex(idx - 1);
          const next = [...digits];
          next[idx - 1] = "";
          setDigits(next);
        }
        return;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (idx > 0) focusIndex(idx - 1);
        return;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (idx < length - 1) focusIndex(idx + 1);
        return;
      }
      case "Home": {
        e.preventDefault();
        focusIndex(0);
        return;
      }
      case "End": {
        e.preventDefault();
        const firstEmpty = digits.findIndex((d) => d === "");
        focusIndex(firstEmpty === -1 ? length - 1 : firstEmpty);
        return;
      }
      default:
        break;
    }
  };

  const handlePaste = (
    idx: number,
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    if (disabled) return;
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!paste) return;

    const next = [...digits];
    let writeIndex = idx;
    for (const ch of paste) {
      if (writeIndex >= length) break;
      next[writeIndex] = ch;
      writeIndex++;
    }
    setDigits(next);
    focusIndex(Math.min(writeIndex, length - 1));
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className="flex items-center gap-2"
        aria-label="One-time password input"
      >
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={error ? true : undefined}
            maxLength={1}
            className={cn(
              "h-12 w-10 rounded-md border bg-background text-center text-lg font-medium text-foreground outline-none otp-input",
              "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              "border-input transition-all duration-200",
              "hover:border-border/70 hover:bg-background/80",
              disabled && "cursor-not-allowed opacity-50",
              error && "border-destructive focus:ring-destructive"
            )}
            value={digits[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            onFocus={(e) => e.currentTarget.select()}
            disabled={disabled}
          />
        ))}
      </div>

      {name ? (
        <input type="hidden" name={name} value={digits.join("")} />
      ) : null}

      <p className="sr-only" aria-live="polite">
        {digits.every((d) => d !== "")
          ? "Code complete"
          : "Enter your verification code"}
      </p>
    </div>
  );
}

export { OTPInput as OtpInput };
