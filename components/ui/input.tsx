import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
          <input
            ref={ref}
            className={cn(
              "w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white text-sm text-slate-900 placeholder:text-slate-400 transition-all",
              "focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200",
              className
            )}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 border rounded-lg bg-white text-sm text-slate-900 placeholder:text-slate-400 transition-all",
          "focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
          error
            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
            : "border-slate-200",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
