import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "UbaJob — Sua próxima oportunidade está em Ubatuba",
  description: "Plataforma local de emprego para Ubatuba e litoral norte de São Paulo. Conectando candidatos e empregadores locais.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-sand-50">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
