"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Sparkles, CheckCircle } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { jobCategories } from "@/lib/mock-data";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ContractType, WorkRegime, ExperienceLevel, SalaryPeriod } from "@/lib/types";

const contracts: ContractType[] = ["CLT", "PJ", "Temporário", "Estágio", "Freelance", "Autônomo"];
const regimes: WorkRegime[] = ["Presencial", "Remoto", "Híbrido"];
const levels: ExperienceLevel[] = ["Sem experiência", "Júnior", "Pleno", "Sênior"];

export default function PublicarVagaPage() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAppStore();

  const [form, setForm] = useState({
    title: "",
    category: "",
    subcategory: "",
    contractType: "" as ContractType | "",
    regime: "" as WorkRegime | "",
    experience: "" as ExperienceLevel | "",
    salaryMin: "",
    salaryMax: "",
    salaryPeriod: "mês" as SalaryPeriod,
    seasonal: false,
    seasonStart: "",
    seasonEnd: "",
    description: "",
    deadline: "",
  });
  const [questions, setQuestions] = useState<{ text: string; required: boolean }[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  if (!isAuthenticated || currentUser?.role !== "employer") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Acesso restrito</h2>
        <p className="text-gray-500 text-sm mb-4">Você precisa estar logado como empregador.</p>
        <Button onClick={() => router.push("/auth/login")}>Entrar</Button>
      </div>
    );
  }

  const selectedCat = jobCategories.find((c) => c.value === form.category);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/dashboard/empregador"), 2000);
  }

  async function handleAIDescription() {
    if (!form.title) return;
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setForm({
      ...form,
      description: `## Sobre a vaga\n\nBuscamos um(a) ${form.title} comprometido(a) e dinâmico(a) para integrar nossa equipe.\n\n## Responsabilidades\n\n- Executar as atividades inerentes ao cargo com excelência\n- Colaborar com a equipe para alcançar os objetivos da empresa\n- Manter comunicação eficiente com clientes e colegas\n\n## Requisitos\n\n- Experiência prévia na função (diferencial)\n- Boa comunicação verbal e escrita\n- Proatividade e trabalho em equipe\n\n## O que oferecemos\n\n- Ambiente de trabalho colaborativo\n- Oportunidades de crescimento\n- Salário compatível com o mercado`,
    });
    setAiLoading(false);
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Vaga publicada!</h2>
        <p className="text-gray-500 text-sm">Redirecionando para o dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Publicar nova vaga</h1>
        <p className="text-gray-500 text-sm mt-1">Preencha os dados abaixo para encontrar os melhores candidatos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Informações básicas</h2>
          <Input
            label="Título da vaga *"
            placeholder="Ex: Recepcionista de Pousada"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "" })}
                className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                required
              >
                <option value="">Selecionar...</option>
                {jobCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subcategoria</label>
              <select
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="">Selecionar...</option>
                {selectedCat?.subcategories.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Contract + regime */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Condições de trabalho</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contrato *</label>
              <select value={form.contractType} onChange={(e) => setForm({ ...form, contractType: e.target.value as ContractType })} className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required>
                <option value="">Selecionar...</option>
                {contracts.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Regime *</label>
              <select value={form.regime} onChange={(e) => setForm({ ...form, regime: e.target.value as WorkRegime })} className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required>
                <option value="">Selecionar...</option>
                {regimes.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nível *</label>
              <select value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value as ExperienceLevel })} className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required>
                <option value="">Selecionar...</option>
                {levels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faixa salarial <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                placeholder="Mínimo (R$)"
                type="number"
                min="0"
                value={form.salaryMin}
                onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                required
              />
              <Input
                placeholder="Máximo (R$)"
                type="number"
                min="0"
                value={form.salaryMax}
                onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                required
              />
              <div>
                <select
                  value={form.salaryPeriod}
                  onChange={(e) => setForm({ ...form, salaryPeriod: e.target.value as SalaryPeriod })}
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  required
                >
                  <option value="mês">por mês</option>
                  <option value="semana">por semana</option>
                  <option value="dia">por dia</option>
                  <option value="hora">por hora</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Informe a faixa que você pretende pagar. Ambos os valores são obrigatórios.</p>
          </div>

          {/* Seasonal */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.seasonal} onChange={(e) => setForm({ ...form, seasonal: e.target.checked })} className="accent-primary" />
              🌊 Vaga sazonal
            </label>
            {form.seasonal && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <Input placeholder="Início (ex: Dezembro)" value={form.seasonStart} onChange={(e) => setForm({ ...form, seasonStart: e.target.value })} />
                <Input placeholder="Fim (ex: Fevereiro)" value={form.seasonEnd} onChange={(e) => setForm({ ...form, seasonEnd: e.target.value })} />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Descrição da vaga</h2>
            <Button type="button" variant="secondary" size="sm" loading={aiLoading} onClick={handleAIDescription} disabled={!form.title}>
              <Sparkles size={14} /> Gerar com IA
            </Button>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={10}
            placeholder="Descreva a vaga em detalhes: responsabilidades, requisitos, diferenciais..."
            className="w-full px-4 py-3 rounded-xl border border-sand-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            required
          />
          <p className="text-xs text-gray-400">Dica: Use ## para títulos e - para listas. Ou clique em "Gerar com IA" para criar automaticamente.</p>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Benefícios</h2>
          <div className="flex gap-2">
            <Input placeholder="Ex: Vale transporte" value={newBenefit} onChange={(e) => setNewBenefit(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newBenefit.trim()) { setBenefits([...benefits, newBenefit.trim()]); setNewBenefit(""); } } }} />
            <Button type="button" variant="secondary" onClick={() => { if (newBenefit.trim()) { setBenefits([...benefits, newBenefit.trim()]); setNewBenefit(""); } }}>
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {benefits.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/15 rounded-xl text-sm text-primary">
                {b}
                <button type="button" onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))}>
                  <Trash2 size={12} className="text-primary/50 hover:text-red-500 transition-colors" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Perguntas eliminatórias</h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setQuestions([...questions, { text: "", required: false }])}>
              <Plus size={14} /> Adicionar
            </Button>
          </div>
          {questions.map((q, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="Ex: Você possui CNH?"
                value={q.text}
                onChange={(e) => setQuestions(questions.map((qq, ii) => ii === i ? { ...qq, text: e.target.value } : qq))}
              />
              <label className="flex items-center gap-1 text-xs text-gray-500 shrink-0 mt-3.5 cursor-pointer">
                <input type="checkbox" checked={q.required} onChange={(e) => setQuestions(questions.map((qq, ii) => ii === i ? { ...qq, required: e.target.checked } : qq))} className="accent-primary" />
                Obrigatória
              </label>
              <button type="button" onClick={() => setQuestions(questions.filter((_, ii) => ii !== i))} className="mt-3 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Deadline */}
        <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
          <Input label="Prazo para candidaturas *" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Publicar vaga
        </Button>
      </form>
    </div>
  );
}
