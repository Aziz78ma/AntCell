import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[120px] w-full rounded-2xl border border-border/90 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition duration-300 placeholder:text-foreground/35 focus:border-cyan/45 focus:bg-cyan/5 focus:shadow-cyan",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";

export { Textarea };
