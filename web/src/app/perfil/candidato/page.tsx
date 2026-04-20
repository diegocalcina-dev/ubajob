"use client";
import { MapPin, Briefcase, GraduationCap, Star, Edit3, CheckCircle, Globe } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { mockCandidateProfiles } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

const skillLevelColor = { Básico: "neutral", Intermediário: "accent", Avançado: "success" } as const;

export default function PerfilCandidatoPage() {
  const { currentUser, isAuthenticated } = useAppStore();

  const profile = mockCandidateProfiles.find((p) => p.userId === currentUser?.id)
    ?? mockCandidateProfiles[0];

  const isOwn = currentUser?.id === profile.userId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      {/* Banner + avatar */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-700 to-accent-400" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <img
              src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.userId}`}
              alt="Avatar"
              className="w-24 h-24 rounded-2xl border-4 border-white bg-sand-100 shadow-md"
            />
            {isOwn && (
              <Button variant="outline" size="sm">
                <Edit3 size={14} /> Editar perfil
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">{currentUser?.name ?? "Lucas Ferreira"}</h1>
              <p className="flex items-center gap-1.5 text-gray-500 text-sm mt-0.5">
                <MapPin size={13} /> {profile.city}, {profile.state}
              </p>
              <p className="text-sm text-gray-600 mt-2 max-w-xl">{profile.bio}</p>
            </div>

            {/* Completeness */}
            <div className="bg-sand-50 rounded-xl p-4 w-full sm:w-40 sm:min-w-40">
              <p className="text-xs text-gray-500 mb-1">Completude do perfil</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-sand-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${profile.profileCompleteness}%` }} />
                </div>
                <span className="text-sm font-bold text-primary">{profile.profileCompleteness}%</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="primary">{profile.availability}</Badge>
            {profile.desiredContracts.map((c) => (
              <Badge key={c} variant="neutral">{c}</Badge>
            ))}
            {profile.salaryVisible && profile.salaryMin && (
              <Badge variant="accent">
                💰 {formatCurrency(profile.salaryMin)} – {formatCurrency(profile.salaryMax ?? profile.salaryMin)}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Experience */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Briefcase size={16} className="text-primary" /> Experiência
          </h2>
          <div className="space-y-4">
            {profile.experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-accent pl-4">
                <p className="font-semibold text-sm text-gray-900">{exp.role}</p>
                <p className="text-xs text-primary">{exp.company}</p>
                <p className="text-xs text-gray-400">{exp.startDate} – {exp.current ? "Presente" : exp.endDate}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{exp.description}</p>
              </div>
            ))}
            {profile.experiences.length === 0 && (
              <p className="text-sm text-gray-400">Nenhuma experiência adicionada.</p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <GraduationCap size={16} className="text-primary" /> Formação
          </h2>
          <div className="space-y-4">
            {profile.education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-accent pl-4">
                <p className="font-semibold text-sm text-gray-900">{edu.course}</p>
                <p className="text-xs text-primary">{edu.institution}</p>
                <p className="text-xs text-gray-400">{edu.level} · {edu.startDate} – {edu.current ? "Em andamento" : edu.endDate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Star size={16} className="text-primary" /> Habilidades
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span key={skill.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-sand-50 border border-sand-200 rounded-xl text-sm text-gray-700">
                {skill.validated && <CheckCircle size={12} className="text-primary" />}
                <span>{skill.name}</span>
                <Badge variant={skillLevelColor[skill.level]} className="text-xs py-0 px-1.5">{skill.level}</Badge>
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Globe size={16} className="text-primary" /> Idiomas
          </h2>
          <div className="space-y-2">
            {profile.languages.map((lang) => (
              <div key={lang.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-800">{lang.name}</span>
                <Badge variant="neutral">{lang.level}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOwn && (
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10 p-5 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-700">
            <strong>Dica:</strong> Adicione um vídeo de apresentação de 60s para se destacar nas candidaturas.
          </p>
          <Button variant="secondary" size="sm">Adicionar vídeo</Button>
        </div>
      )}
    </div>
  );
}
