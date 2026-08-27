import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-cyan-500 focus-visible:ring-1 focus-visible:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
