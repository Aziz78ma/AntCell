import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-cyan/12 text-cyan-bright shadow-cyan hover:-translate-y-0.5 hover:bg-cyan/18",
        ghost:
          "border border-border/70 bg-white/5 text-foreground/80 hover:border-cyan/40 hover:bg-cyan/10 hover:text-cyan-bright",
        gold: "bg-gold/15 text-gold-bright shadow-gold hover:-translate-y-0.5 hover:bg-gold/20",
        outline:
          "border border-border bg-transparent text-foreground/80 hover:border-cyan/50 hover:bg-cyan/10 hover:text-cyan-bright",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-12 rounded-2xl px-5 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <motion.button
      ref={ref as any}
      className={cn(buttonVariants({ variant, size, className }))}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 600, damping: 22 }}
      {...(props as any)}
    />
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
