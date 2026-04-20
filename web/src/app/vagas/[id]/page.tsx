"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Briefcase, Clock, Users, Waves, BookmarkCheck, Bookmark,
  ArrowLeft, Building2, Star, CheckCircle, Sparkles, Send,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { mockJobs, mockEmployerProfiles } from "@/lib/mock-data";
import { formatSalary, formatDate, formatRelativeDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import MatchScore from "@/components/ui/MatchScore";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, currentUser, savedJobs, toggleSaveJob, applyToJob, applications } = useAppStore();

  const job = mockJobs.find((j) => j.id === id);
  const employer = mockEmployerProfiles.find((e) => e.userId === job?.employerId);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Vaga não encontrada</h2>
        <Link href="/vagas" className="text-primary hover:underline">← Voltar para vagas</Link>
      </div>
    );
  }

  const isSaved = savedJobs.includes(job.id);
  const existingApp = applications.find((a) => a.jobId === job.id && a.candidateId === currentUser?.id);
  const hasApplied = !!existingApp || applied;

  async function handleApply() {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if ((job?.questions.length ?? 0) > 0 || true) {
      setShowApplyModal(true);
      return;
    }
    await submitApplication();
  }

  async function submitApplication() {
    setApplying(true);
    await new Promise((r) => setTimeout(r, 1000));
    applyToJob(job!.id, coverLetter);
    setApplying(false);
    setApplied(true);
    setShowApplyModal(false);
  }

  const contractColors: Record<string, "primary" | "accent" | "success" | "warning" | "neutral"> = {
    CLT: "success", PJ: "primary", Temporário: "warning", Estágio: "accent",
    Freelance: "neutral", Autônomo: "neutral",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Voltar
      </button>

      {/* Mobile CTA fixo na base */}
      {!hasApplied && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-sand-200 p-4 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <button
            onClick={() => { if (!isAuthenticated) { router.push("/auth/login"); return; } toggleSaveJob(job.id); }}
            className="w-12 h-12 rounded-xl border-2 border-sand-200 flex items-center justify-center text-gray-500 hover:border-primary/30 hover:text-primary transition-all shrink-0"
          >
            {isSaved ? <BookmarkCheck size={18} className="text-primary" /> : <Bookmark size={18} />}
          </button>
          <Button onClick={handleApply} className="flex-1" size="lg">
            <Send size={15} /> Candidatar-se
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 pb-24 lg:pb-0">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-6">
            {job.featured && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mb-3">
                ⭐ Vaga em destaque
              </span>
            )}
            <div className="flex gap-4">
              <img
                src={job.employerLogo || `https://api.dicebear.com/7.x/shapes/svg?seed=${job.employerId}`}
                alt={job.employerName}
                className="w-16 h-16 rounded-2xl bg-sand-100 object-cover shrink-0"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-black text-gray-900">{job.title}</h1>
                <Link href={`/perfil/empregador?id=${job.employerId}`} className="text-primary font-semibold hover:underline">
                  {job.employerName}
                </Link>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <MapPin size={13} /> {job.city}, {job.state}
                  <span className="text-gray-300">·</span>
                  <Clock size={13} /> {formatRelativeDate(job.publishedAt)}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant={contractColors[job.contractType] ?? "neutral"}>{job.contractType}</Badge>
              <Badge variant="neutral">{job.regime}</Badge>
              <Badge variant="neutral">{job.experience}</Badge>
              {job.seasonal && (
                <Badge variant="seasonal">
                  <Waves size={11} /> Sazonal · {job.seasonStart}–{job.seasonEnd}
                </Badge>
              )}
            </div>

            {/* Salary */}
            <div className="mt-4 p-3 bg-sand-50 rounded-xl flex items-center gap-2">
              <Briefcase size={16} className="text-primary" />
              <span className="font-semibold text-gray-800">
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}
              </span>
              <span className="text-xs text-gray-400">· {job.applications} candidatura{job.applications !== 1 ? "s" : ""}</span>
            </div>

            {/* Match score (if logged in) */}
            {isAuthenticated && job.matchScore && (
              <div className="mt-3 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10 flex items-center gap-3">
                <Sparkles size={16} className="text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary">Compatibilidade com seu perfil</p>
                  <p className="text-xs text-gray-500">Baseado nas suas habilidades e experiência</p>
                </div>
                <MatchScore score={job.matchScore} size="lg" />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Descrição da vaga</h2>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-2">
              {job.description.split("\n").map((line, i) => {
                if (line.startsWith("## ")) return <h3 key={i} className="text-base font-bold text-gray-900 mt-4">{line.replace("## ", "")}</h3>;
                if (line.startsWith("- ")) return <p key={i} className="flex items-start gap-2"><span className="text-primary mt-1">•</span>{line.replace("- ", "")}</p>;
                if (line.trim() === "") return <div key={i} className="h-1" />;
                return <p key={i}>{line}</p>;
              })}
            </div>
          </div>

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Benefícios</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {job.benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-primary shrink-0" /> {b}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deadline */}
          <p className="text-xs text-gray-400 text-center">
            Prazo para candidatura: <strong>{formatDate(job.deadline)}</strong>
          </p>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:block">
          {/* Apply card — oculto em mobile, CTA fixo na base substitui */}
          <div className="hidden lg:block bg-white rounded-2xl border border-sand-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-5 sticky top-20">
            {hasApplied ? (
              <div className="text-center py-4">
                <CheckCircle size={36} className="text-green-500 mx-auto mb-3" />
                <p className="font-bold text-gray-900">Candidatura enviada!</p>
                <p className="text-sm text-gray-500 mt-1">Acompanhe o status no seu dashboard.</p>
                <Link href="/dashboard/candidato" className="block mt-4 text-sm font-semibold text-primary hover:underline">
                  Ver candidaturas →
                </Link>
              </div>
            ) : (
              <>
                <Button onClick={handleApply} className="w-full mb-3" size="lg">
                  <Send size={15} /> Candidatar-se
                </Button>
                <button
                  onClick={() => {
                    if (!isAuthenticated) { router.push("/auth/login"); return; }
                    toggleSaveJob(job.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-sand-200 text-sm font-semibold text-gray-600 hover:border-primary/30 hover:text-primary transition-all"
                >
                  {isSaved ? <><BookmarkCheck size={15} className="text-primary" /> Salvo</> : <><Bookmark size={15} /> Salvar vaga</>}
                </button>
                {!isAuthenticated && (
                  <p className="text-xs text-gray-400 text-center mt-2">
                    <Link href="/auth/login" className="text-primary hover:underline">Entre</Link> para se candidatar
                  </p>
                )}
              </>
            )}
          </div>

          {/* Employer card */}
          {employer && (
            <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-5">
              <h3 className="font-bold text-sm text-gray-800 mb-3">Sobre a empresa</h3>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={employer.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${employer.userId}`}
                  alt={employer.companyName}
                  className="w-10 h-10 rounded-xl bg-sand-100 object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-gray-900">{employer.companyName}</p>
                  <p className="text-xs text-gray-500">{employer.sector} · {employer.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-gray-800">{employer.rating}</span>
                <span className="text-xs text-gray-400">({employer.reviewCount} avaliações)</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">{employer.description}</p>
              <Link
                href={`/perfil/empregador?id=${employer.userId}`}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Building2 size={12} /> Ver perfil completo
              </Link>
            </div>
          )}

          {/* Related jobs */}
          <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-5">
            <h3 className="font-bold text-sm text-gray-800 mb-3">Vagas similares</h3>
            <div className="space-y-2">
              {mockJobs
                .filter((j) => j.id !== job.id && j.category === job.category)
                .slice(0, 3)
                .map((j) => (
                  <Link
                    key={j.id}
                    href={`/vagas/${j.id}`}
                    className="block p-3 rounded-xl hover:bg-sand-50 transition-colors border border-sand-100"
                  >
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{j.title}</p>
                    <p className="text-xs text-gray-500">{j.employerName}</p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-sand-100">
              <h2 className="text-xl font-black text-gray-900">Candidatar-se</h2>
              <p className="text-sm text-gray-500">{job.title} · {job.employerName}</p>
            </div>
            <div className="p-6 space-y-5">
              {job.questions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-gray-800">Perguntas da empresa</h3>
                  {job.questions.map((q) => (
                    <div key={q.id}>
                      <label className="block text-sm text-gray-700 mb-1.5">
                        {q.text} {q.required && <span className="text-red-400">*</span>}
                      </label>
                      <textarea
                        value={answers[q.id] ?? ""}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2.5 rounded-xl border border-sand-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                        placeholder="Sua resposta..."
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Carta de apresentação <span className="font-normal text-gray-400">(opcional)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  placeholder="Apresente-se brevemente e destaque por que você é o candidato ideal..."
                  className="w-full px-3 py-2.5 rounded-xl border border-sand-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-sand-100 flex gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-sand-200 text-sm font-semibold text-gray-600 hover:border-primary/30 hover:text-primary transition-all"
              >
                Cancelar
              </button>
              <Button onClick={submitApplication} loading={applying} className="flex-1" size="md">
                <Send size={14} /> Enviar candidatura
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
