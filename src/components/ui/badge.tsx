import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.22em]",
  {
    variants: {
      variant: {
        cyan: "border-cyan/30 bg-cyan/12 text-cyan-bright",
        gold: "border-gold/30 bg-gold/12 text-gold-bright",
        ghost: "border-border/70 bg-white/6 text-foreground/60",
        success: "border-success/30 bg-success/10 text-success",
      },
    },
    defaultVariants: {
      variant: "ghost",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
