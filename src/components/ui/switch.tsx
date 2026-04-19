import * as React from "react";

import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({
  checked = false,
  onCheckedChange,
  className,
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full border transition duration-300",
        checked
          ? "border-cyan/40 bg-cyan/15 shadow-cyan"
          : "border-border/80 bg-white/5",
        className,
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span
        className={cn(
          "absolute left-1 top-1 h-5 w-5 rounded-full bg-gradient-to-br from-white to-foreground/70 transition-transform duration-300",
          checked ? "translate-x-5 bg-gradient-to-br from-cyan-bright to-cyan" : "",
        )}
      />
    </button>
  );
}
