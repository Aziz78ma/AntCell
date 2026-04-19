import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border/90 bg-white/5 px-4 py-2 text-sm text-foreground outline-none transition duration-300 placeholder:text-foreground/35 focus:border-cyan/45 focus:bg-cyan/5 focus:shadow-cyan",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export { Input };
