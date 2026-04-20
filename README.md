# UbaJob 🌊

> **"Sua próxima oportunidade está em Ubatuba."**

Plataforma hiperlocal de busca de emprego para o litoral norte de São Paulo — conectando candidatos e empresas de Ubatuba, Caraguatatuba, São Sebastião e Ilhabela com IA embarcada para matching inteligente.

---

## 🎯 Problema

Ubatuba e região têm forte sazonalidade no mercado de trabalho (turismo, hotelaria, gastronomia) e carecem de uma plataforma local especializada. Plataformas genéricas como Indeed e LinkedIn não atendem às PMEs locais — que não têm time de RH e precisam de uma solução simples, rápida e focada na realidade do litoral.

## 💡 Solução

Aplicativo mobile-first com:
- Vagas filtradas por localização, categoria e tipo de contrato
- Tag **Sazonal** para vagas de temporada com período definido
- **Match Score por IA** — compatibilidade candidato ↔ vaga com explicação
- Pipeline Kanban para empregadores gerenciarem candidatos
- Onboarding personalizado para candidatos e empregadores

---

## 🖥️ Demo local

```bash
cd web
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

Para testar sem cadastro, use os atalhos na tela de login:
- **Entrar como Candidato** — acesso ao perfil do Lucas, busca de vagas e dashboard
- **Entrar como Empregador** — acesso ao dashboard com kanban e publicação de vagas

---

## 🗂️ Estrutura do projeto

```
ubajob/
├── web/                    # Next.js 16 (App Router)
│   ├── src/
│   │   ├── app/            # Páginas (App Router)
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── auth/                 # Login, Cadastro, Onboarding
│   │   │   ├── vagas/                # Busca, Detalhe, Publicar
│   │   │   ├── dashboard/            # Candidato e Empregador
│   │   │   ├── perfil/               # Candidato e Empregador
│   │   │   ├── mensagens/            # Chat interno
│   │   │   └── notificacoes/         # Central de notificações
│   │   ├── components/
│   │   │   ├── layout/   # Navbar
│   │   │   ├── jobs/     # JobCard, filtros
│   │   │   └── ui/       # Button, Badge, Input, Card, MatchScore
│   │   ├── lib/
│   │   │   ├── types.ts      # Tipos TypeScript
│   │   │   ├── mock-data.ts  # Dados de demonstração
│   │   │   └── utils.ts      # Helpers
│   │   └── store/
│   │       └── app-store.ts  # Estado global (Zustand)
└── PRD.md                  # Product Requirements Document
```

---

## ⚙️ Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 · App Router · TypeScript |
| Estilização | Tailwind CSS v4 |
| Estado | Zustand (com persistência local) |
| Ícones | Lucide React |
| Dados | Mock data (sem backend nesta versão) |

---

## 🎨 Design System

| Token | Valor |
|---|---|
| Cor primária | `#006D77` — Azul-petróleo |
| Cor de fundo | `#F2E9D8` — Areia |
| Accent | `#83C5BE` — Verde-água |
| Tipografia | Inter |

---

## 📱 Telas implementadas

| Rota | Descrição |
|---|---|
| `/` | Landing page |
| `/auth/login` | Login com acesso rápido demo |
| `/auth/cadastro` | Cadastro com seleção de papel |
| `/auth/onboarding` | Onboarding personalizado por papel |
| `/vagas` | Busca com filtros + drawer mobile |
| `/vagas/[id]` | Detalhe da vaga + candidatura |
| `/vagas/publicar` | Publicar vaga (empregador) |
| `/dashboard/candidato` | Painel de candidaturas |
| `/dashboard/empregador` | Kanban de candidatos por vaga |
| `/perfil/candidato` | Perfil completo do candidato |
| `/perfil/empregador` | Perfil da empresa |
| `/mensagens` | Chat interno |
| `/notificacoes` | Central de notificações |

---

## 🗺️ Roadmap

- **v1 atual** — Frontend completo com dados mock, responsivo (mobile · tablet · desktop)
- **v1 próxima** — Backend NestJS + PostgreSQL, autenticação real, Claude API para match score
- **v2** — App mobile React Native, calendário de entrevistas, analytics, multi-idioma

---

## 📄 Licença

Projeto privado — © 2026 Diego Calcina. Todos os direitos reservados.
