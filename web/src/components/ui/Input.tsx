import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon: Icon, iconRight: IconRight, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        )}
        <div className="relative">
          {Icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon size={16} />
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 rounded-xl border border-sand-200 bg-white text-gray-900 placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-sm",
              Icon && "pl-10",
              IconRight && "pr-10",
              error && "border-red-400 focus:ring-red-200",
              className
            )}
            {...props}
          />
          {IconRight && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <IconRight size={16} />
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
