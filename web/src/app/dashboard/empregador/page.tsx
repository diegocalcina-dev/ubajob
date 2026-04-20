"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Users, Briefcase, TrendingUp, MessageSquare, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { mockEmployerApplications, mockJobs } from "@/lib/mock-data";
import { formatRelativeDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import MatchScore from "@/components/ui/MatchScore";
import Button from "@/components/ui/Button";
import { Application, ApplicationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const KANBAN_COLS: { status: ApplicationStatus; label: string; color: string }[] = [
  { status: "Aplicada", label: "Novas", color: "bg-gray-100 text-gray-700" },
  { status: "Em análise", label: "Em Análise", color: "bg-amber-100 text-amber-700" },
  { status: "Entrevista", label: "Entrevista", color: "bg-blue-100 text-blue-700" },
  { status: "Aprovado", label: "Aprovado", color: "bg-green-100 text-green-700" },
  { status: "Recusado", label: "Recusado", color: "bg-red-100 text-red-600" },
];

export default function DashboardEmpregadorPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAppStore();
  const [selectedJob, setSelectedJob] = useState<string>("j1");
  const [appStatus, setAppStatus] = useState<Record<string, ApplicationStatus>>(
    Object.fromEntries(mockEmployerApplications.map((a) => [a.id, a.status]))
  );

  if (!isAuthenticated) {
    router.replace("/auth/login");
    return null;
  }

  const myJobs = mockJobs.filter((j) => j.employerId === "u2").slice(0, 3);
  const jobApps = mockEmployerApplications.filter((a) => a.jobId === selectedJob);

  const totalApps = mockEmployerApplications.length;
  const totalJobs = myJobs.length;
  const interviews = mockEmployerApplications.filter((a) => a.status === "Entrevista").length;

  function moveCard(appId: string, newStatus: ApplicationStatus) {
    setAppStatus((prev) => ({ ...prev, [appId]: newStatus }));
  }

  const getColApps = (status: ApplicationStatus) =>
    jobApps.filter((a) => appStatus[a.id] === status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard do Empregador</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gerencie suas vagas e candidatos.</p>
        </div>
        <Link href="/vagas/publicar">
          <Button size="md">
            <Plus size={16} /> Publicar Vaga
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Vagas ativas", value: totalJobs, icon: Briefcase, color: "bg-primary/10 text-primary" },
          { label: "Candidaturas", value: totalApps, icon: Users, color: "bg-accent/20 text-accent-500" },
          { label: "Entrevistas", value: interviews, icon: TrendingUp, color: "bg-green-100 text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-sand-200 p-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", stat.color)}>
              <stat.icon size={18} />
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Jobs list */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between p-5 border-b border-sand-100">
          <h2 className="font-bold text-gray-900">Suas Vagas</h2>
          <Link href="/vagas/publicar" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <Plus size={13} /> Nova vaga
          </Link>
        </div>
        <div className="divide-y divide-sand-100">
          {myJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job.id)}
              className={cn(
                "flex items-center gap-4 p-4 cursor-pointer transition-colors",
                selectedJob === job.id ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-sand-50/50"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full shrink-0", job.applications > 5 ? "bg-green-400" : "bg-sand-300")} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{job.title}</p>
                <p className="text-xs text-gray-500">{job.contractType} · {job.regime}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Users size={12} /> {job.applications}
                </span>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-bold text-gray-900">Pipeline de Candidatos</h2>
            <p className="text-sm text-gray-400">{mockJobs.find((j) => j.id === selectedJob)?.title}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 self-start sm:self-auto">
            <Sparkles size={12} /> Ordenado por Match IA
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-3 sm:hidden flex items-center gap-1">
          ← Deslize para ver todas as etapas →
        </p>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {KANBAN_COLS.map((col) => {
            const colApps = getColApps(col.status);
            return (
              <div key={col.status} className="w-64 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", col.color)}>
                    {col.label}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{colApps.length}</span>
                </div>
                <div className="space-y-3 min-h-28">
                  {colApps.map((app) => (
                    <KanbanCard
                      key={app.id}
                      app={app}
                      onMove={(newStatus) => moveCard(app.id, newStatus)}
                      currentStatus={appStatus[app.id]}
                    />
                  ))}
                  {colApps.length === 0 && (
                    <div className="border-2 border-dashed border-sand-200 rounded-xl h-24 flex items-center justify-center">
                      <p className="text-xs text-gray-300">Sem candidatos</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI triagem tip */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10 p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">Triagem automática com IA</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            A IA analisou os {totalApps} candidatos e ranqueou por compatibilidade com a vaga.
            Os candidatos com match acima de 80% têm maior probabilidade de sucesso.
          </p>
          <Link href="/mensagens" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-primary hover:underline">
            Enviar mensagem para os top candidatos <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function KanbanCard({ app, onMove, currentStatus }: {
  app: Application;
  onMove: (status: ApplicationStatus) => void;
  currentStatus: ApplicationStatus;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const nextStatuses = KANBAN_COLS
    .map((c) => c.status)
    .filter((s) => s !== currentStatus);

  return (
    <div className="bg-white rounded-xl border border-sand-200 p-3 shadow-[0_1px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_3px_14px_rgba(0,0,0,0.09)] transition-all">
      <div className="flex items-center gap-2 mb-2">
        <img
          src={app.candidateAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.candidateId}`}
          alt={app.candidateName}
          className="w-7 h-7 rounded-full bg-sand-100"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">{app.candidateName}</p>
          <p className="text-xs text-gray-400">{formatRelativeDate(app.appliedAt)}</p>
        </div>
        {app.matchScore && <MatchScore score={app.matchScore} size="sm" showLabel={false} />}
      </div>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-full text-xs text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg py-1.5 transition-colors flex items-center justify-center gap-1"
        >
          Mover para <ChevronRight size={11} />
        </button>
        {showMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl border border-sand-200 shadow-lg z-10 overflow-hidden">
            {nextStatuses.map((s) => (
              <button
                key={s}
                onClick={() => { onMove(s); setShowMenu(false); }}
                className="w-full text-left text-xs px-3 py-2 hover:bg-primary/5 hover:text-primary transition-colors"
              >
                → {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
