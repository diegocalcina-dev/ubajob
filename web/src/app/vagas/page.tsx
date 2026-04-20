"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Waves, MapPin } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { jobCategories } from "@/lib/mock-data";
import JobCard from "@/components/jobs/JobCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { ContractType, WorkRegime } from "@/lib/types";

const contractOptions: ContractType[] = ["CLT", "PJ", "Temporário", "Estágio", "Freelance", "Autônomo"];
const regimeOptions: WorkRegime[] = ["Presencial", "Remoto", "Híbrido"];

interface FilterSidebarProps {
  selectedCategory: string; setSelectedCategory: (v: string) => void;
  selectedContracts: string[]; setSelectedContracts: (v: string[]) => void;
  selectedRegime: string[]; setSelectedRegime: (v: string[]) => void;
  onlySeasonal: boolean; setOnlySeasonal: (v: boolean) => void;
}

function FilterSidebar({ selectedCategory, setSelectedCategory, selectedContracts, setSelectedContracts, selectedRegime, setSelectedRegime, onlySeasonal, setOnlySeasonal }: FilterSidebarProps) {
  function toggle(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  }
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-sand-200 p-4">
        <h3 className="font-semibold text-sm text-gray-800 mb-3">Categoria</h3>
        <div className="space-y-1">
          <button onClick={() => setSelectedCategory("")} className={cn("w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors", !selectedCategory ? "bg-primary/10 text-primary font-semibold" : "text-gray-600 hover:bg-sand-50")}>Todas</button>
          {jobCategories.map((cat) => (
            <button key={cat.value} onClick={() => setSelectedCategory(selectedCategory === cat.value ? "" : cat.value)} className={cn("w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors", selectedCategory === cat.value ? "bg-primary/10 text-primary font-semibold" : "text-gray-600 hover:bg-sand-50")}>{cat.label}</button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-sand-200 p-4">
        <h3 className="font-semibold text-sm text-gray-800 mb-3">Tipo de contrato</h3>
        <div className="space-y-2">
          {contractOptions.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={selectedContracts.includes(c)} onChange={() => toggle(selectedContracts, setSelectedContracts, c)} className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm text-gray-700">{c}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-sand-200 p-4">
        <h3 className="font-semibold text-sm text-gray-800 mb-3">Regime</h3>
        <div className="space-y-2">
          {regimeOptions.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={selectedRegime.includes(r)} onChange={() => toggle(selectedRegime, setSelectedRegime, r)} className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm text-gray-700">{r}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-sand-200 p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={onlySeasonal} onChange={(e) => setOnlySeasonal(e.target.checked)} className="w-4 h-4 rounded accent-primary" />
          <div>
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-1"><Waves size={13} className="text-orange-500" /> Sazonais</p>
            <p className="text-xs text-gray-400">Vagas com período definido</p>
          </div>
        </label>
      </div>
    </div>
  );
}
const sortOptions = [
  { value: "relevance", label: "Relevância" },
  { value: "recent", label: "Mais recentes" },
  { value: "salary_desc", label: "Maior salário" },
  { value: "match", label: "Melhor match" },
];

function VagasContent() {
  const searchParams = useSearchParams();
  const { jobs } = useAppStore();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("categoria") ?? "");
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [selectedRegime, setSelectedRegime] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState("");
  const [onlySeasonal, setOnlySeasonal] = useState(searchParams.get("seasonal") === "true");
  const [sort, setSort] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  function toggleFilter(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  }

  const filtered = useMemo(() => {
    let list = [...jobs];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.employerName.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) list = list.filter((j) => j.category === selectedCategory);
    if (selectedContracts.length) list = list.filter((j) => selectedContracts.includes(j.contractType));
    if (selectedRegime.length) list = list.filter((j) => selectedRegime.includes(j.regime));
    if (salaryMin) list = list.filter((j) => (j.salaryMin ?? 0) >= Number(salaryMin));
    if (onlySeasonal) list = list.filter((j) => j.seasonal);

    if (sort === "recent") list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    if (sort === "salary_desc") list.sort((a, b) => (b.salaryMax ?? b.salaryMin ?? 0) - (a.salaryMax ?? a.salaryMin ?? 0));
    if (sort === "match") list.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

    return list;
  }, [jobs, query, selectedCategory, selectedContracts, selectedRegime, salaryMin, onlySeasonal, sort]);

  const activeFilters = [
    ...(selectedCategory ? [selectedCategory] : []),
    ...selectedContracts,
    ...selectedRegime,
    ...(onlySeasonal ? ["Sazonal"] : []),
  ];

  function clearAllFilters() {
    setSelectedCategory("");
    setSelectedContracts([]);
    setSelectedRegime([]);
    setSalaryMin("");
    setOnlySeasonal(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar vagas, empresa ou categoria..."
            icon={Search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all",
            showFilters ? "border-primary bg-primary/10 text-primary" : "border-sand-200 text-gray-600 hover:border-primary/30"
          )}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filtros</span>
          {activeFilters.length > 0 && (
            <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {activeFilters.map((f) => (
            <span key={f} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {f}
              <button onClick={() => {
                if (f === selectedCategory) setSelectedCategory("");
                else if (f === "Sazonal") setOnlySeasonal(false);
                else if (contractOptions.includes(f as ContractType)) toggleFilter(selectedContracts, setSelectedContracts, f);
                else if (regimeOptions.includes(f as WorkRegime)) toggleFilter(selectedRegime, setSelectedRegime, f);
              }}>
                <X size={11} />
              </button>
            </span>
          ))}
          <button onClick={clearAllFilters} className="text-xs text-gray-400 hover:text-primary ml-1">
            Limpar todos
          </button>
        </div>
      )}

      {/* Mobile filter drawer overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="relative ml-auto w-80 max-w-full h-full bg-white overflow-y-auto shadow-2xl p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900">Filtros</span>
              <button onClick={() => setShowFilters(false)} className="p-1.5 rounded-lg hover:bg-sand-100">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <FilterSidebar
              selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
              selectedContracts={selectedContracts} setSelectedContracts={setSelectedContracts}
              selectedRegime={selectedRegime} setSelectedRegime={setSelectedRegime}
              onlySeasonal={onlySeasonal} setOnlySeasonal={setOnlySeasonal}
            />
            <Button className="w-full" onClick={() => setShowFilters(false)}>Ver {filtered.length} vagas</Button>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar filters — desktop only */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <FilterSidebar
            selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
            selectedContracts={selectedContracts} setSelectedContracts={setSelectedContracts}
            selectedRegime={selectedRegime} setSelectedRegime={setSelectedRegime}
            onlySeasonal={onlySeasonal} setOnlySeasonal={setOnlySeasonal}
          />
        </aside>

        {/* Jobs list */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{filtered.length}</span> vagas encontradas
              {query && <span> para "<strong>{query}</strong>"</span>}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-sand-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <MapPin size={40} className="text-sand-300 mb-4" />
              <h3 className="font-bold text-lg text-gray-700 mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-xs">Tente ajustar os filtros ou ampliar a busca.</p>
              <Button variant="outline" onClick={clearAllFilters}>Limpar filtros</Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VagasPage() {
  return (
    <Suspense>
      <VagasContent />
    </Suspense>
  );
}
