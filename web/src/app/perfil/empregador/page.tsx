"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Star, Briefcase, Globe, Edit3, Users, CheckCircle, ArrowLeft } from "lucide-react";
import { mockEmployerProfiles, mockJobs } from "@/lib/mock-data";
import { useAppStore } from "@/store/app-store";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import JobCard from "@/components/jobs/JobCard";
import Link from "next/link";

function PerfilContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser } = useAppStore();

  const id = searchParams.get("id") ?? currentUser?.id ?? "u2";
  const profile = mockEmployerProfiles.find((p) => p.userId === id) ?? mockEmployerProfiles[0];
  const activeJobs = mockJobs.filter((j) => j.employerId === profile.userId);
  const isOwn = currentUser?.id === profile.userId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-2 transition-colors">
        <ArrowLeft size={15} /> Voltar
      </button>

      {/* Banner + logo */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="h-36 bg-gradient-to-r from-primary-700 via-primary to-accent-400" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-14 mb-4">
            <img
              src={profile.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${profile.userId}`}
              alt={profile.companyName}
              className="w-24 h-24 rounded-2xl border-4 border-white bg-sand-100 shadow-md object-cover"
            />
            {isOwn && (
              <Button variant="outline" size="sm">
                <Edit3 size={14} /> Editar empresa
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">{profile.companyName}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={13} /> {profile.city}, {profile.state}</span>
                <span className="flex items-center gap-1"><Star size={13} className="text-amber-400 fill-amber-400" /> {profile.rating} ({profile.reviewCount} avaliações)</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="primary">{profile.sector}</Badge>
                <Badge variant="neutral">{profile.size}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                  <Globe size={14} /> Site
                </a>
              )}
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Briefcase size={14} /> {profile.activeJobs} vaga{profile.activeJobs !== 1 ? "s" : ""} ativa{profile.activeJobs !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mt-4 max-w-2xl">{profile.description}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Benefits */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-primary" /> Benefícios
          </h2>
          <div className="space-y-2">
            {profile.benefits.map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={13} className="text-primary shrink-0" /> {b}
              </div>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={16} className="text-primary" /> Avaliações de ex-funcionários
          </h2>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-4xl font-black text-gray-900">{profile.rating}</p>
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i <= Math.round(profile.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">{profile.reviewCount} avaliações</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {["Ambiente de trabalho", "Gestão", "Salário & benefícios", "Oportunidade de crescimento"].map((item, i) => {
              const val = [4.8, 4.6, 4.2, 4.0][i];
              return (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-40 shrink-0">{item}</span>
                  <div className="flex-1 h-1.5 bg-sand-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(val / 5) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-6">{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active jobs */}
      {activeJobs.length > 0 && (
        <div>
          <h2 className="font-bold text-gray-900 mb-4 text-lg">Vagas abertas ({activeJobs.length})</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {activeJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PerfilEmpregadorPage() {
  return (
    <Suspense>
      <PerfilContent />
    </Suspense>
  );
}
