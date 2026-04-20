"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Briefcase, UserCheck } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerWithApi } = useAppStore();
  const defaultRole = searchParams.get("role") === "employer" ? "employer" : "candidate";

  const [role, setRole] = useState<"candidate" | "employer">(defaultRole);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerWithApi(form.name, form.email, form.password, role);
      router.push("/auth/onboarding");
    } catch (err: any) {
      setError(err.message ?? "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-sand-50">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="font-black text-white text-sm">U</span>
          </div>
          <span className="font-black text-xl text-primary">Uba<span className="text-accent-400">Job</span></span>
        </Link>

        <div className="bg-white rounded-3xl border border-sand-200 shadow-[0_4px_30px_rgba(0,0,0,0.08)] p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">Criar conta gratuita</h1>
          <p className="text-gray-500 text-sm mb-6">Comece a usar o UbaJob hoje mesmo.</p>

          {/* Role selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {(["candidate", "employer"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200",
                  role === r
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-sand-200 text-gray-500 hover:border-primary/30"
                )}
              >
                {r === "candidate" ? <UserCheck size={24} /> : <Briefcase size={24} />}
                <span className="font-semibold text-sm">
                  {r === "candidate" ? "Candidato" : "Empregador"}
                </span>
                <span className="text-xs opacity-70 text-center leading-tight">
                  {r === "candidate" ? "Busco emprego" : "Quero contratar"}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={role === "candidate" ? "Nome completo" : "Nome da empresa"}
              type="text"
              placeholder={role === "candidate" ? "Ex: João Silva" : "Ex: Pousada Mar Azul"}
              icon={User}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div className="relative">
              <Input
                label="Senha"
                type={showPwd ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                icon={Lock}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 bottom-3 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Ao criar a conta você concorda com os{" "}
              <Link href="#" className="text-primary hover:underline">Termos de Uso</Link> e a{" "}
              <Link href="#" className="text-primary hover:underline">Política de Privacidade</Link>.
            </p>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Criar conta grátis
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Já tem conta?{" "}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <Suspense>
      <CadastroForm />
    </Suspense>
  );
}
