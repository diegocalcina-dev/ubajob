"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell, MessageSquare, Briefcase, User, Moon, Sun, Menu, X,
  ChevronDown, LogOut, Settings, LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthenticated, logout, notifications, theme, toggleTheme } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = isAuthenticated
    ? currentUser?.role === "candidate"
      ? [
          { href: "/vagas", label: "Vagas", icon: Briefcase },
          { href: "/dashboard/candidato", label: "Minhas Candidaturas", icon: LayoutDashboard },
          { href: "/mensagens", label: "Mensagens", icon: MessageSquare },
        ]
      : [
          { href: "/vagas/publicar", label: "Publicar Vaga", icon: Briefcase },
          { href: "/dashboard/empregador", label: "Dashboard", icon: LayoutDashboard },
          { href: "/mensagens", label: "Mensagens", icon: MessageSquare },
        ]
    : [
        { href: "/vagas", label: "Explorar Vagas", icon: Briefcase },
        { href: "/para-empresas", label: "Para Empresas", icon: null },
      ];

  function handleLogout() {
    logout();
    router.push("/");
    setUserMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sand-200 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-black text-sm">U</span>
            </div>
            <span className="font-black text-lg tracking-tight text-primary">
              Uba<span className="text-accent-400">Job</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                )}
              >
                {link.icon && <link.icon size={15} />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link
                  href="/notificacoes"
                  className="relative p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-sand-100 transition-colors"
                  >
                    <img
                      src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}`}
                      alt={currentUser?.name}
                      className="w-7 h-7 rounded-full bg-sand-200"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-24 truncate">
                      {currentUser?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.12)] border border-sand-200 py-1 z-50">
                      <div className="px-3 py-2 border-b border-sand-100">
                        <p className="text-sm font-semibold text-gray-800">{currentUser?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                      </div>
                      <Link
                        href={currentUser?.role === "candidate" ? "/perfil/candidato" : "/perfil/empregador"}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-sand-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={15} /> Meu Perfil
                      </Link>
                      <Link
                        href="/configuracoes"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-sand-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={15} /> Configurações
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 rounded-xl transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/cadastro"
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors shadow-[0_2px_8px_rgba(0,109,119,0.25)]"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-sand-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-sand-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.icon && <link.icon size={16} />}
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-sand-100 flex gap-2">
                <Link href="/auth/login" className="flex-1 text-center py-2.5 text-sm font-semibold text-primary border border-primary rounded-xl">
                  Entrar
                </Link>
                <Link href="/auth/cadastro" className="flex-1 text-center py-2.5 text-sm font-semibold bg-primary text-white rounded-xl">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
