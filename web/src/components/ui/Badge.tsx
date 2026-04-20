import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "success" | "warning" | "danger" | "seasonal" | "neutral";
  className?: string;
}

export default function Badge({ children, variant = "primary", className }: BadgeProps) {
  const variants = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/20 text-primary-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-600",
    seasonal: "bg-orange-100 text-orange-700",
    neutral: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
