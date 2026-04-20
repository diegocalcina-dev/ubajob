"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase, CheckCircle, Clock, XCircle, MessageSquare,
  Bell, TrendingUp, Bookmark, ArrowRight, User,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { mockJobs } from "@/lib/mock-data";
import { formatRelativeDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import MatchScore from "@/components/ui/MatchScore";
import { ApplicationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: React.ElementType; badge: "primary" | "accent" | "warning" | "success" | "danger" }> = {
  "Aplicada": { label: "Aplicada", color: "text-gray-500", icon: Clock, badge: "neutral" as never },
  "Em análise": { label: "Em análise", color: "text-amber-600", icon: Clock, badge: "warning" },
  "Entrevista": { label: "Entrevista", color: "text-primary", icon: MessageSquare, badge: "primary" },
  "Aprovado": { label: "Aprovado", color: "text-green-600", icon: CheckCircle, badge: "success" },
  "Recusado": { label: "Recusado", color: "text-red-500", icon: XCircle, badge: "danger" },
};

export default function DashboardCandidatoPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated, applications, savedJobs, notifications } = useAppStore();

  if (!isAuthenticated) {
    router.replace("/auth/login");
    return null;
  }

  const myApps = applications.filter((a) => a.candidateId === currentUser?.id);
  const savedJobsList = mockJobs.filter((j) => savedJobs.includes(j.id));
  const unread = notifications.filter((n) => !n.read).length;

  const statusGroups = (["Aplicada", "Em análise", "Entrevista", "Aprovado", "Recusado"] as ApplicationStatus[])
    .map((s) => ({ status: s, count: myApps.filter((a) => a.status === s).length }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Olá, {currentUser?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Aqui está um resumo das suas candidaturas.</p>
        </div>
        <Link
          href="/perfil/candidato"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-sand-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-primary/30 hover:text-primary transition-all shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
        >
          <User size={15} /> Meu Perfil
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statusGroups.map((sg) => {
          const cfg = statusConfig[sg.status];
          return (
            <div key={sg.status} className="bg-white rounded-2xl border border-sand-200 p-4 text-center shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
              <p className="text-2xl font-black text-gray-900">{sg.count}</p>
              <Badge variant={cfg.badge}>{cfg.label}</Badge>
            </div>
          );
        })}
      </div>

      {/* Applications list */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between p-5 border-b border-sand-100">
          <h2 className="font-bold text-gray-900">Minhas Candidaturas</h2>
          <span className="text-xs text-gray-400">{myApps.length} total</span>
        </div>

        {myApps.length === 0 ? (
          <div className="py-16 text-center">
            <Briefcase size={32} className="text-sand-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold mb-1">Nenhuma candidatura ainda</p>
            <p className="text-sm text-gray-400 mb-4">Explore vagas e candidate-se em um clique.</p>
            <Link href="/vagas" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Explorar vagas <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-sand-100">
            {myApps.map((app) => {
              const cfg = statusConfig[app.status];
              return (
                <div key={app.id} className="flex items-center gap-4 p-5 hover:bg-sand-50/50 transition-colors">
                  <img
                    src={app.employerLogo || `https://api.dicebear.com/7.x/shapes/svg?seed=${app.jobId}`}
                    alt={app.employerName}
                    className="w-10 h-10 rounded-xl bg-sand-100 object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{app.jobTitle}</p>
                    <p className="text-xs text-gray-500">{app.employerName}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {app.matchScore && <MatchScore score={app.matchScore} size="sm" showLabel={false} />}
                    <Badge variant={cfg.badge}>{cfg.label}</Badge>
                    <span className="text-xs text-gray-400 hidden sm:block">{formatRelativeDate(app.appliedAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Saved jobs */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between p-5 border-b border-sand-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Bookmark size={16} className="text-primary" /> Vagas salvas
            </h2>
            <span className="text-xs text-gray-400">{savedJobsList.length}</span>
          </div>
          {savedJobsList.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400">Nenhuma vaga salva ainda.</p>
              <Link href="/vagas" className="text-xs font-semibold text-primary mt-2 block">Explorar vagas →</Link>
            </div>
          ) : (
            <div className="divide-y divide-sand-100">
              {savedJobsList.slice(0, 4).map((job) => (
                <Link key={job.id} href={`/vagas/${job.id}`} className="flex items-center gap-3 p-4 hover:bg-sand-50/50 transition-colors">
                  <img src={job.employerLogo || `https://api.dicebear.com/7.x/shapes/svg?seed=${job.id}`} alt="" className="w-8 h-8 rounded-lg bg-sand-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.employerName}</p>
                  </div>
                  {job.matchScore && <MatchScore score={job.matchScore} size="sm" showLabel={false} />}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between p-5 border-b border-sand-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Bell size={16} className="text-primary" /> Notificações
            </h2>
            {unread > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">{unread} novas</span>}
          </div>
          <div className="divide-y divide-sand-100">
            {useAppStore.getState().notifications.slice(0, 4).map((n) => (
              <div key={n.id} className={cn("flex gap-3 p-4", !n.read && "bg-primary/5")}>
                <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", !n.read ? "bg-primary" : "bg-gray-200")} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI tips */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Dica da IA para melhorar seu perfil</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Complete sua bio e adicione uma foto de perfil para aumentar em <strong>40%</strong> suas chances de ser chamado para entrevistas.
              Candidatos com perfil completo recebem 3x mais visualizações.
            </p>
            <Link href="/perfil/candidato" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-primary hover:underline">
              Completar perfil <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
