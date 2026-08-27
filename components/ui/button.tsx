import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-cyan-500/25 hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-red-500/25 hover:shadow-lg",
        outline:
          "border border-white/10 bg-slate-900/50 hover:bg-slate-800/80 hover:text-cyan-400 hover:border-cyan-500/50 backdrop-blur-sm",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-purple-500/25 hover:shadow-lg",
        ghost: "hover:bg-slate-800/60 hover:text-cyan-400",
        link: "text-primary underline-offset-4 hover:underline",
        neonCyan:
          "bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:from-cyan-400 hover:to-blue-500 border border-cyan-400/40",
        neonPurple:
          "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40",
        neonAmber:
          "bg-gradient-to-r from-amber-500 to-orange-600 text-black font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:from-amber-400 hover:to-orange-500 border border-amber-400/40",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
