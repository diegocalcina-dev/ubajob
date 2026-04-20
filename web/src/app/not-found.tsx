import Link from "next/link";
import { Waves, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <span className="text-8xl font-black text-primary/10 select-none">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <Waves size={52} className="text-primary" />
        </div>
      </div>
      <h1 className="text-2xl font-black text-gray-900 mb-2">Página não encontrada</h1>
      <p className="text-gray-500 max-w-xs mb-8 text-sm leading-relaxed">
        Essa página não existe ou foi removida. Mas tem muitas vagas esperando por você!
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors text-sm">
          <Home size={15} /> Voltar ao início
        </Link>
        <Link href="/vagas" className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors text-sm">
          <Search size={15} /> Ver vagas
        </Link>
      </div>
    </div>
  );
}
