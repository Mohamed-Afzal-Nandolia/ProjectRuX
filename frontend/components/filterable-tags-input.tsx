"use client";

import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FilterableTagsInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
};

// Helper: convert ENUM_NAME → "Enum Name"
export function formatEnumLabel(enumValue: string): string {
  return enumValue
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function FilterableTagsInput({
  value,
  onChange,
  options,
  placeholder = "Type to search and select",
  className,
  ...rest
}: FilterableTagsInputProps) {
  const [input, setInput] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  // Filter options based on input and exclude already selected
  const filteredOptions = React.useMemo(() => {
    return options
      .filter(
        (option) =>
          !value.includes(option) &&
          formatEnumLabel(option).toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 options for better UX
  }, [options, value, input]);

  function addTag(tag: string) {
    if (!tag.trim()) return;
    if (value.includes(tag)) return;
    onChange([...value, tag]);
    setInput("");
    setIsOpen(false);
    setFocusedIndex(-1);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
        addTag(filteredOptions[focusedIndex]);
      } else if (filteredOptions.length > 0) {
        // ✅ Always take the first suggestion if available
        addTag(filteredOptions[0]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setFocusedIndex(-1);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setInput(newValue);
    setIsOpen(newValue.length > 0);
    setFocusedIndex(-1);
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border bg-background px-3 py-2",
          className
        )}
      >
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            <span>{formatEnumLabel(tag)}</span>
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
        <div className="flex flex-1 items-center gap-1">
          <Input
            {...rest}
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            onFocus={() => input && setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
            placeholder={placeholder}
            className="m-0 h-6 flex-1 border-0 p-0 focus-visible:ring-0"
          />
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {filteredOptions.map((option, index) => (
            <button
              key={option}
              type="button"
              onClick={() => addTag(option)}
              className={cn(
                "w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                index === focusedIndex && "bg-accent text-accent-foreground"
              )}
            >
              {formatEnumLabel(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
