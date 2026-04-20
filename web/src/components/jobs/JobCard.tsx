"use client";
import { Bookmark, BookmarkCheck, MapPin, Clock, Briefcase, Waves } from "lucide-react";
import Link from "next/link";
import { Job } from "@/lib/types";
import { formatSalary, formatRelativeDate, cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import MatchScore from "@/components/ui/MatchScore";
import { useAppStore } from "@/store/app-store";

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

const contractColors: Record<string, "primary" | "accent" | "success" | "warning" | "neutral"> = {
  CLT: "success",
  PJ: "primary",
  Temporário: "warning",
  Estágio: "accent",
  Freelance: "neutral",
  Autônomo: "neutral",
};

const regimeIcons: Record<string, string> = {
  Presencial: "🏢",
  Remoto: "🏠",
  Híbrido: "🔀",
};

export default function JobCard({ job, compact = false }: JobCardProps) {
  const { savedJobs, toggleSaveJob, isAuthenticated } = useAppStore();
  const isSaved = savedJobs.includes(job.id);

  return (
    <div className={cn(
      "bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_6px_28px_rgba(0,0,0,0.10)] hover:-translate-y-0.5",
      job.featured && "ring-2 ring-primary/20",
      compact ? "p-4" : "p-5"
    )}>
      {job.featured && (
        <div className="flex items-center gap-1 mb-3">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">⭐ Destaque</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        {/* Logo + info */}
        <div className="flex gap-3 flex-1 min-w-0">
          <img
            src={job.employerLogo || `https://api.dicebear.com/7.x/shapes/svg?seed=${job.employerId}`}
            alt={job.employerName}
            className="w-11 h-11 rounded-xl bg-sand-100 object-cover shrink-0"
          />
          <div className="min-w-0">
            <Link href={`/vagas/${job.id}`} className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-1">
              {job.title}
            </Link>
            <p className="text-sm text-gray-500 mt-0.5">{job.employerName}</p>
          </div>
        </div>

        {/* Save + Match */}
        <div className="flex items-center gap-2 shrink-0">
          {job.matchScore && <MatchScore score={job.matchScore} size="sm" />}
          {isAuthenticated && (
            <button
              onClick={(e) => { e.preventDefault(); toggleSaveJob(job.id); }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label={isSaved ? "Remover dos salvos" : "Salvar vaga"}
            >
              {isSaved ? <BookmarkCheck size={16} className="text-primary" /> : <Bookmark size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        <Badge variant={contractColors[job.contractType] ?? "neutral"}>{job.contractType}</Badge>
        <Badge variant="neutral">{regimeIcons[job.regime]} {job.regime}</Badge>
        {job.seasonal && (
          <Badge variant="seasonal">
            <Waves size={11} /> Sazonal {job.seasonStart && `· ${job.seasonStart}–${job.seasonEnd}`}
          </Badge>
        )}
      </div>

      {/* Location + salary + date */}
      {!compact && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {job.city}, {job.state}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={12} /> {formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Clock size={12} /> {formatRelativeDate(job.publishedAt)}
          </span>
        </div>
      )}

      {/* Apply button */}
      <div className="mt-4">
        <Link
          href={`/vagas/${job.id}`}
          className="block w-full text-center py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-200"
        >
          Ver vaga
        </Link>
      </div>
    </div>
  );
}
