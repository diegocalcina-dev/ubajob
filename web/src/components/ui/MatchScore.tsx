import { cn } from "@/lib/utils";

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function MatchScore({ score, size = "md", showLabel = true }: MatchScoreProps) {
  const color = score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-gray-500";
  const bg = score >= 80 ? "bg-green-50" : score >= 60 ? "bg-amber-50" : "bg-gray-50";
  const border = score >= 80 ? "border-green-200" : score >= 60 ? "border-amber-200" : "border-gray-200";

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full font-semibold border", color, bg, border, sizes[size])}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {score}%{showLabel && <span className="font-normal opacity-70">match</span>}
    </span>
  );
}
