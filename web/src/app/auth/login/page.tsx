"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Waves } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    // Demo: email com "empresa" → employer, senão candidate
    const role = form.email.includes("empresa") || form.email.includes("pousada") ? "employer" : "candidate";
    login(form.email, role);
    setLoading(false);
    router.push(role === "candidate" ? "/vagas" : "/dashboard/empregador");
  }

  function quickLogin(role: "candidate" | "employer") {
    login(role === "candidate" ? "lucas@email.com" : "fernanda@pousada.com", role);
    router.push(role === "candidate" ? "/vagas" : "/dashboard/empregador");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-gradient-to-br from-primary-800 via-primary to-accent-400 p-12 text-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="font-black text-white">U</span>
          </div>
          <span className="font-black text-xl">UbaJob</span>
        </Link>
        <div>
          <Waves size={40} className="text-accent-300 mb-6" />
          <h2 className="text-3xl font-black leading-snug mb-4">
            O trabalho que você quer está aqui no litoral.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Mais de 120 vagas em Ubatuba e região. Candidate-se em segundos com perfil completo e match por IA.
          </p>
        </div>
        <p className="text-white/40 text-xs">© 2026 UbaJob</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-sand-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900">Bem-vindo de volta 👋</h1>
            <p className="text-gray-500 mt-1 text-sm">Entre na sua conta para continuar.</p>
          </div>

          {/* Quick demo buttons */}
          <div className="mb-6 p-4 bg-accent/10 rounded-2xl border border-accent/20">
            <p className="text-xs font-semibold text-primary mb-3">🚀 Acesso rápido (demo)</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => quickLogin("candidate")} className="py-2 px-3 text-xs font-semibold bg-white border border-primary/20 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors">
                👤 Entrar como Candidato
              </button>
              <button onClick={() => quickLogin("employer")} className="py-2 px-3 text-xs font-semibold bg-white border border-primary/20 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors">
                🏢 Entrar como Empregador
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-sand-200" />
            <span className="text-xs text-gray-400">ou com e-mail</span>
            <div className="flex-1 h-px bg-sand-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div className="relative">
              <Input
                label="Senha"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                icon={Lock}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 bottom-3 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div className="flex justify-end">
              <Link href="#" className="text-xs text-primary hover:underline">Esqueci minha senha</Link>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Não tem conta?{" "}
            <Link href="/auth/cadastro" className="text-primary font-semibold hover:underline">
              Cadastrar grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
