import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-sand-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-5",
        hover && "hover:shadow-[0_4px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
