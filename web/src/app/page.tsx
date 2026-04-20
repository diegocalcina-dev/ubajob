"use client";
import Link from "next/link";
import { Search, Briefcase, Users, TrendingUp, MapPin, Waves, Sparkles, ArrowRight, Building2, Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockJobs, mockEmployerProfiles } from "@/lib/mock-data";
import JobCard from "@/components/jobs/JobCard";
import Badge from "@/components/ui/Badge";

const stats = [
  { label: "Vagas ativas", value: "120+", icon: Briefcase },
  { label: "Empresas cadastradas", value: "48", icon: Building2 },
  { label: "Contratações realizadas", value: "340+", icon: Users },
];

const categories = [
  { label: "Turismo", emoji: "🏖️", count: 32 },
  { label: "Gastronomia", emoji: "🍽️", count: 24 },
  { label: "Hospitalidade", emoji: "🏨", count: 18 },
  { label: "Esportes & Lazer", emoji: "🏄", count: 12 },
  { label: "Saúde", emoji: "💊", count: 9 },
  { label: "Comércio", emoji: "🛍️", count: 15 },
  { label: "Construção", emoji: "🔨", count: 8 },
  { label: "Tecnologia", emoji: "💻", count: 5 },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/vagas${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  const featuredJobs = mockJobs.filter((j) => j.featured).slice(0, 3);
  const recentJobs = mockJobs.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary to-accent-400 text-white">
        {/* Decorative waves */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-96 h-48 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Waves size={16} className="text-accent-200" />
              <span className="text-accent-200 text-sm font-medium">Ubatuba · Caraguatatuba · São Sebastião · Ilhabela</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
              Sua próxima oportunidade está em{" "}
              <span className="text-accent-300">Ubatuba.</span>
            </h1>
            <p className="text-lg text-white/80 mb-8">
              A plataforma de empregos feita para o litoral norte de SP. Conecte-se com empresas locais, vagas sazonais e oportunidades permanentes.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
              <div className="flex items-center gap-2 flex-1 bg-white rounded-xl px-4">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Cargo, empresa ou categoria..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 py-3 text-gray-900 bg-transparent outline-none text-sm placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-white text-primary font-bold rounded-xl hover:bg-sand-100 transition-colors shrink-0 flex items-center gap-1.5"
              >
                Buscar <ArrowRight size={15} />
              </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-4">
              {["Recepcionista", "Garçom", "Instrutor de Surf", "Cozinheiro"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => router.push(`/vagas?q=${encodeURIComponent(tag)}`)}
                  className="px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs hover:bg-white/25 transition-colors border border-white/20"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-sand-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-sand-200">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4 py-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <stat.icon size={18} className="text-primary" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl font-black text-primary">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IA Feature banner */}
      <section className="bg-gradient-to-r from-accent-50 to-primary-50 border-b border-sand-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Sparkles size={16} className="text-primary" />
              </div>
              <div>
                <span className="font-semibold text-sm text-primary">Match com IA</span>
                <span className="text-sm text-gray-600 ml-1">— Veja o % de compatibilidade com cada vaga baseado no seu perfil</span>
              </div>
            </div>
            <Link href="/auth/cadastro" className="shrink-0 text-sm font-semibold text-primary hover:text-primary-700 flex items-center gap-1">
              Ativar <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-14">

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Explorar por categoria</h2>
            <Link href="/vagas" className="text-sm font-semibold text-primary hover:text-primary-700 flex items-center gap-1">
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`/vagas?categoria=${encodeURIComponent(cat.label)}`}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-sand-200 hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(0,109,119,0.12)] transition-all duration-200 group"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800 group-hover:text-primary transition-colors">{cat.label}</p>
                  <p className="text-xs text-gray-400">{cat.count} vagas</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured jobs */}
        {featuredJobs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Vagas em destaque</h2>
                <Badge variant="primary">⭐ Premium</Badge>
              </div>
              <Link href="/vagas" className="text-sm font-semibold text-primary hover:text-primary-700 flex items-center gap-1">
                Ver todas <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        )}

        {/* Recent jobs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Vagas recentes</h2>
              <Badge variant="accent">Novas</Badge>
            </div>
            <Link href="/vagas" className="text-sm font-semibold text-primary hover:text-primary-700 flex items-center gap-1">
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        {/* Employers section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Empresas que estão contratando</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {mockEmployerProfiles.map((emp) => (
              <Link
                key={emp.userId}
                href={`/perfil/empregador?id=${emp.userId}`}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-sand-200 hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(0,109,119,0.10)] transition-all duration-200"
              >
                <img
                  src={emp.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${emp.userId}`}
                  alt={emp.companyName}
                  className="w-12 h-12 rounded-xl bg-sand-100 object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{emp.companyName}</p>
                  <p className="text-xs text-gray-500">{emp.sector}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-gray-500">{emp.rating} · {emp.activeJobs} vaga{emp.activeJobs !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA — For employers */}
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-primary-800 p-8 sm:p-12 text-white text-center">
          <TrendingUp size={32} className="mx-auto mb-4 text-accent-300" />
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Você é empregador?
          </h2>
          <p className="text-white/80 max-w-lg mx-auto mb-6 text-sm sm:text-base">
            Publique vagas em minutos, use IA para triagem automática e encontre os candidatos certos para a temporada ou para o ano todo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/cadastro?role=employer"
              className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-sand-100 transition-colors"
            >
              Criar conta gratuita
            </Link>
            <Link
              href="/para-empresas"
              className="px-6 py-3 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Saiba mais
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-sand-200 mt-8 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-black text-xs">U</span>
            </div>
            <span className="font-black text-primary">Uba<span className="text-accent-400">Job</span></span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            © 2026 UbaJob · Conectando talentos e empresas do litoral norte de SP
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="#" className="hover:text-primary">Privacidade</Link>
            <Link href="#" className="hover:text-primary">Termos</Link>
            <Link href="#" className="hover:text-primary">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
