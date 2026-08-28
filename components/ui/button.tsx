import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-mono font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer uppercase tracking-wider",
  {
    variants: {
      variant: {
        default:
          "bg-[#E85A4F] text-white shadow-sm hover:bg-[#C94A40]",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline:
          "border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] hover:bg-[#1A1918] hover:text-[#EAE7DC]",
        secondary:
          "bg-[#1A1918] text-[#EAE7DC] shadow-sm hover:bg-[#E85A4F] hover:text-white",
        ghost: "hover:bg-[#EAE7DC] text-[#1A1918] hover:text-[#E85A4F]",
        link: "text-[#E85A4F] underline-offset-4 hover:underline",
        neonCyan:
          "bg-[#E85A4F] text-white font-bold shadow-sm hover:bg-[#C94A40]",
        neonPurple:
          "bg-[#1A1918] text-[#EAE7DC] font-bold hover:bg-[#E85A4F] hover:text-white",
        neonAmber:
          "bg-[#E85A4F] text-white font-bold hover:bg-[#C94A40]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-lg px-3 text-[11px]",
        lg: "h-12 rounded-2xl px-8 text-sm",
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
