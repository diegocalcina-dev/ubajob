"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Briefcase, DollarSign, CheckCircle, ArrowRight, ArrowLeft,
  Users, Tag, Clock,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ─── Fluxo do CANDIDATO ───────────────────────────────────────────────────────
const candidateSteps = [
  {
    id: "location",
    title: "Onde você mora?",
    subtitle: "Vamos mostrar vagas perto de você.",
    icon: MapPin,
    multi: false,
    options: ["Ubatuba", "Caraguatatuba", "São Sebastião", "Ilhabela", "Outra"],
  },
  {
    id: "contract",
    title: "Que tipo de vaga procura?",
    subtitle: "Selecione um ou mais tipos de contrato.",
    icon: Briefcase,
    multi: true,
    options: ["CLT", "PJ", "Temporário", "Estágio", "Freelance", "Autônomo"],
  },
  {
    id: "salary",
    title: "Qual sua pretensão salarial?",
    subtitle: "Isso nos ajuda a mostrar vagas compatíveis.",
    icon: DollarSign,
    multi: false,
    options: [
      "Até R$ 1.500/mês",
      "R$ 1.500 – R$ 2.500/mês",
      "R$ 2.500 – R$ 4.000/mês",
      "R$ 4.000 – R$ 7.000/mês",
      "Acima de R$ 7.000/mês",
    ],
  },
];

// ─── Fluxo do EMPREGADOR ──────────────────────────────────────────────────────
const employerSteps = [
  {
    id: "location",
    title: "Onde fica sua empresa?",
    subtitle: "Suas vagas aparecerão para candidatos da região.",
    icon: MapPin,
    multi: false,
    options: ["Ubatuba", "Caraguatatuba", "São Sebastião", "Ilhabela", "Outra"],
  },
  {
    id: "sector",
    title: "Qual o setor da sua empresa?",
    subtitle: "Vamos personalizar sua experiência na plataforma.",
    icon: Tag,
    multi: false,
    options: [
      "Turismo & Hotelaria",
      "Gastronomia",
      "Comércio",
      "Saúde",
      "Construção",
      "Esportes & Lazer",
      "Imóveis",
      "Tecnologia",
      "Outro",
    ],
  },
  {
    id: "contract_type",
    title: "Que tipo de contrato você costuma oferecer?",
    subtitle: "Selecione um ou mais. Você pode mudar isso a qualquer momento.",
    icon: Briefcase,
    multi: true,
    options: ["CLT", "PJ", "Temporário", "Estágio", "Freelance", "Autônomo"],
  },
  {
    id: "hiring_frequency",
    title: "Com que frequência você contrata?",
    subtitle: "Isso nos ajuda a recomendar as melhores ferramentas para você.",
    icon: Clock,
    multi: false,
    options: [
      "Sazonalmente (temporada)",
      "Algumas vezes por ano",
      "Mensalmente",
      "Constantemente",
    ],
  },
  {
    id: "team_size",
    title: "Qual o tamanho da sua equipe hoje?",
    subtitle: "Apenas para entender melhor o seu porte.",
    icon: Users,
    multi: false,
    options: ["Só eu (MEI)", "2 a 5 pessoas", "6 a 20 pessoas", "21 a 50 pessoas", "Mais de 50"],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser } = useAppStore();
  const isEmployer = currentUser?.role === "employer";

  const steps = isEmployer ? employerSteps : candidateSteps;

  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  function toggle(key: string, value: string, multi: boolean) {
    if (multi) {
      const prev = (selections[key] as string[]) ?? [];
      const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      setSelections({ ...selections, [key]: next });
    } else {
      setSelections({ ...selections, [key]: value });
    }
  }

  function finish() {
    router.push(isEmployer ? "/dashboard/empregador" : "/vagas");
  }

  const selectedVal = selections[currentStep.id];
  const canProceed = currentStep.multi
    ? (selectedVal as string[] ?? []).length > 0
    : !!selectedVal;

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">
              Passo {step + 1} de {steps.length}
            </span>
            <button
              onClick={finish}
              className="text-xs text-gray-400 hover:text-primary transition-colors"
            >
              Pular por agora
            </button>
          </div>
          <div className="h-1.5 bg-sand-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-sand-200 shadow-[0_4px_30px_rgba(0,0,0,0.08)] p-6 sm:p-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <currentStep.icon size={22} className="text-primary" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
            {currentStep.title}
          </h2>
          <p className="text-gray-500 text-sm mb-6">{currentStep.subtitle}</p>

          {/* Options grid — 1 col em mobile, 2 em sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentStep.options.map((opt) => {
              const isSelected = currentStep.multi
                ? (selectedVal as string[] ?? []).includes(opt)
                : selectedVal === opt;
              return (
                <button
                  key={opt}
                  onClick={() => toggle(currentStep.id, opt, currentStep.multi)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 text-left",
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-sand-200 text-gray-600 hover:border-primary/30"
                  )}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle size={15} className="text-primary shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <Button
            onClick={() => isLast ? finish() : setStep(step + 1)}
            disabled={!canProceed}
            size="md"
          >
            {isLast ? "Concluir cadastro" : "Próximo"} <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}
