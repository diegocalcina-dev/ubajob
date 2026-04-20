# PRD — UbaJob: Aplicativo de Busca de Emprego para Ubatuba/SP

**Versão:** 1.0  
**Data:** Abril de 2026  
**Status:** Em validação  
**Autor:** Diego Calcina

---

## 1. Visão do Produto

**Nome:** UbaJob  
**Tagline:** *"Sua próxima oportunidade está em Ubatuba."*  
**Plataformas:** Mobile (iOS + Android via React Native) + Web responsivo (Next.js)

### Problema
Ubatuba é uma cidade litorânea com forte sazonalidade no mercado de trabalho (turismo, hotelaria, gastronomia) e carece de uma plataforma local especializada em conexão entre empregadores e candidatos. Plataformas genéricas como Indeed e LinkedIn não atendem adequadamente às PMEs locais, que não possuem time de RH e precisam de uma solução simples e hiperlocal.

### Solução
Aplicativo mobile-first focado no litoral norte de São Paulo (Ubatuba, Caraguatatuba, São Sebastião, Ilhabela) com IA embarcada para matching inteligente, UX moderno e funcionalidades específicas para o mercado sazonal.

### Público-alvo

| Perfil | Descrição |
|---|---|
| Candidatos | Moradores e temporários de Ubatuba e região |
| Empregadores | Comércios locais, pousadas, restaurantes, clínicas, construtoras, empresas de serviços |

---

## 2. Personas

| Persona | Idade | Perfil | Objetivo no App |
|---|---|---|---|
| Lucas | 22 anos | Mora em Ubatuba, busca primeiro emprego no turismo | Encontrar vaga de recepcionista ou guia turístico |
| Fernanda | 35 anos | Dona de pousada, precisa contratar staff sazonal | Publicar vagas e triar candidatos rapidamente |
| Ricardo | 45 anos | Profissional liberal em recolocação | Visibilidade e contato com empregadores locais |
| Ana | 28 anos | Recém-chegada em Ubatuba, busca trabalho remoto ou local | Encontrar vagas compatíveis com seu perfil |

---

## 3. Funcionalidades — MVP (v1.0)

### 3.1 Autenticação e Cadastro
- Cadastro via e-mail/senha, Google OAuth, Facebook OAuth, LinkedIn OAuth
- Onboarding com seleção de perfil: **Candidato** ou **Empregador**
- Verificação de e-mail obrigatória
- Autenticação 2FA opcional

### 3.2 Perfil do Candidato
- Foto de perfil e banner personalizado
- Bio curta (até 300 caracteres)
- Experiências profissionais (cargo, empresa, período, descrição)
- Formação acadêmica e cursos livres
- Habilidades com níveis (básico / intermediário / avançado) + badges de validação
- Idiomas
- Pretensão salarial (faixa, visível ou oculta para empregadores)
- Disponibilidade: imediata / data específica / apenas sazonal
- Tipo de vaga desejada: CLT, PJ, temporária, estágio, autônomo
- Portfólio com upload de arquivos, imagens e links
- **Vídeo-apresentação** de até 60 segundos
- Importação de perfil via LinkedIn

### 3.3 Perfil do Empregador
- Logo e banner da empresa
- Descrição, setor e porte da empresa
- Localização com mapa interativo
- Galeria de fotos do ambiente de trabalho
- Lista de benefícios oferecidos (customizável)
- Avaliações anônimas de ex-funcionários (sistema de rating)
- Vagas ativas e histórico de vagas publicadas

### 3.4 Publicação de Vagas
- Título e descrição rica (editor markdown)
- Categoria e subcategoria (ex: Turismo > Recepção)
- Tipo de contrato: CLT, PJ, temporário, estágio, freelance
- Regime: presencial, remoto, híbrido
- Salário: fixo, faixa ou "a combinar"
- Nível de experiência exigido
- Prazo de candidatura
- Tag **"Sazonal"** com período definido (ex: dezembro–fevereiro)
- Perguntas eliminatórias opcionais na candidatura
- Limite máximo de candidaturas por vaga
- Opção de destaque pago

### 3.5 Busca e Filtragem de Vagas
Filtros combinados:
- Palavra-chave
- Categoria / subcategoria
- Tipo de contrato e regime
- Faixa salarial
- Localização com raio em km
- Nível de experiência
- Vagas sazonais vs. permanentes
- Data de publicação

Recursos adicionais:
- **Mapa interativo** com pins das vagas
- Ordenação por: relevância, mais recente, salário, distância
- Salvamento de filtros favoritos
- Histórico de buscas

### 3.6 Candidatura e Gestão
- Candidatura em 1 clique com perfil pré-preenchido
- Carta de apresentação opcional por candidatura
- Respostas às perguntas eliminatórias da vaga
- **Painel do Candidato:** Aplicadas / Em análise / Entrevista / Aprovado / Recusado
- **Painel do Empregador:** pipeline kanban de candidatos por vaga
- Feedback de recusa com texto livre pelo empregador

### 3.7 Notificações
- Push notifications via Firebase Cloud Messaging
- E-mail digest configurável (diário / semanal)
- Tipos de alerta:
  - Nova vaga compatível com o perfil
  - Atualização no status da candidatura
  - Nova mensagem recebida
  - Vaga prestes a expirar (empregadores)
  - Período sazonal se aproximando (ex: "verão em 45 dias")
- Central de notificações in-app

### 3.8 Mensagens
- Chat interno entre candidato e empregador (liberado após candidatura)
- Templates de mensagem rápida
- Histórico completo de conversas
- Indicador de leitura

### 3.9 IA — Funcionalidades (diferencial competitivo)

| Funcionalidade | Descrição |
|---|---|
| **Match Score** | Pontuação 0–100% de compatibilidade candidato ↔ vaga com explicação dos pontos fortes e gaps |
| **Resumo Inteligente de Perfil** | IA sugere melhorias no perfil do candidato |
| **Gerador de Descrição de Vaga** | Empregador informa cargo e requisitos; IA gera descrição profissional |
| **Triagem Automática** | IA pré-ranqueia candidatos por compatibilidade para o empregador |
| **Sugestão de Salário** | Baseada em dados regionais, cargo e nível de experiência |
| **Chatbot de Orientação** | Tira dúvidas sobre a plataforma e dá dicas de carreira |

---

## 4. Funcionalidades Futuras (v2.0+)

- **UbaJob Cursos:** parceria com e-learning para fechar gaps de habilidades
- **Indicações (Referral):** sistema de recomendação interna entre usuários
- **Calendário de entrevistas** com integração Google Calendar
- **Relatórios para empregadores:** analytics de candidaturas, visualizações e conversão
- **Plano de Carreira:** IA traça caminho de desenvolvimento com base no perfil
- **Multi-idioma** (EN/ES) para o setor turístico
- **Verificação de identidade** via OCR de documentos
- **Expansão geográfica:** litoral norte de SP completo

---

## 5. UX/UI — Diretrizes de Design

### Design System

| Elemento | Definição |
|---|---|
| Tipografia | Inter (sans-serif, alta legibilidade em mobile) |
| Cor primária | Azul-petróleo `#006D77` |
| Cor de fundo | Areia `#F2E9D8` |
| Accent | Verde-água `#83C5BE` |
| Modo escuro | Nativo, obrigatório |
| Componentes | Cards arredondados, sombras suaves, espaçamento generoso |
| Animações | Micro-animações Lottie em ações-chave |

### Princípios de UX
- **Mobile-first:** toda decisão prioriza a experiência no celular
- **Menos de 3 cliques** nos fluxos principais:
  - Candidatar-se: perfil completo → vaga → 1 clique
  - Publicar vaga: dashboard → formulário → publicar
  - Encontrar candidatos: vaga → lista → ordenar por match → mensagem
- **Onboarding progressivo:** não exigir tudo no cadastro, incentivar completar depois
- **Feedback imediato:** confirmações visuais em cada ação importante

### Acessibilidade
- WCAG 2.1 nível AA mínimo
- Suporte a VoiceOver (iOS) e TalkBack (Android)
- Contraste de cores validado
- Tamanho mínimo de toque: 44×44pt

---

## 6. Arquitetura Técnica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Mobile | React Native (Expo) | Código único iOS + Android, ecossistema maduro |
| Web | Next.js 14 (App Router) | SSR para SEO de vagas, performance |
| Backend | Node.js + NestJS | Tipagem forte, arquitetura modular |
| Banco de dados | PostgreSQL + Redis | Relacional robusto + cache de sessões/buscas |
| Busca | Typesense | Busca full-text rápida, self-hosted, custo menor que Elastic |
| IA/ML | Claude API (Anthropic) | Match, geração de texto, chatbot |
| Auth | JWT + OAuth 2.0 | Google, Facebook, LinkedIn |
| Storage | Cloudflare R2 | Custo-benefício superior ao S3 para MVP |
| Push | Firebase Cloud Messaging | Gratuito, confiável, multiplataforma |
| Infra (MVP) | Railway ou Render | Deploy simples, custo baixo no início |
| Infra (escala) | AWS / GCP | Migrar quando MRR justificar |

### Estrutura do Monorepo

```
ubajob/
├── apps/
│   ├── mobile/          # React Native (Expo)
│   └── web/             # Next.js
├── packages/
│   ├── api/             # Backend NestJS
│   ├── ai/              # Módulo Claude API
│   ├── ui/              # Design system compartilhado
│   └── shared/          # Tipos, utils, validações
└── docs/
    ├── PRD.md           # Este documento
    └── design-system.md # Tokens e componentes
```

---

## 7. Modelo de Negócio

| Plano | Público | Preço | Inclui |
|---|---|---|---|
| **Gratuito** | Candidatos (sempre) | R$ 0 | Perfil completo, candidaturas ilimitadas |
| **Básico Empregador** | PMEs iniciando | R$ 79/mês | Até 3 vagas ativas simultâneas |
| **Pro Empregador** | Empresas em crescimento | R$ 199/mês | Vagas ilimitadas + triagem IA + analytics |
| **Vaga Destaque** | Qualquer empregador | R$ 39/unidade | Vaga em posição de destaque por 7 dias |
| **Perfil Destaque** | Candidatos | R$ 19/mês | Perfil aparece no topo das buscas dos empregadores |

---

## 8. Métricas de Sucesso (KPIs)

### Aquisição
- Cadastros ativos (candidatos e empregadores, separados)
- CAC (custo de aquisição por canal)

### Engajamento
- Taxa de completude de perfil
- DAU / MAU (usuários ativos diários e mensais)
- Retenção D7 / D30

### Negócio
- Taxa de conversão candidatura → entrevista
- Tempo médio de preenchimento de uma vaga
- NPS (Net Promoter Score) — candidatos e empregadores separados
- MRR (Receita Mensal Recorrente)
- Taxa de conversão de plano gratuito → pago

---

## 9. Roadmap

| Fase | Período | Entregáveis |
|---|---|---|
| **Fase 0 — Fundação** | Semanas 1–2 | Monorepo, design system base, CI/CD, banco de dados |
| **Fase 1 — MVP Core** | Semanas 3–8 | Auth, perfis, vagas, busca com filtros, candidatura |
| **Fase 2 — Engajamento** | Semanas 9–12 | Notificações, chat, IA básica (match + gerador de vaga) |
| **Fase 3 — Monetização** | Semanas 13–16 | Planos pagos, vaga destaque, analytics empregador |
| **Fase 4 — Escala** | Mês 5+ | Multi-região litoral SP, v2.0 features, app stores |

---

## 10. Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Baixa adoção inicial | Alto | Médio | Parceria com ACI (Associação Comercial) de Ubatuba e prefeitura |
| Sazonalidade extrema (verão/inverno) | Médio | Alto | Tag "Sazonal" + alertas antecipados (set–out para temporada de verão) |
| Concorrência com Indeed/LinkedIn | Médio | Baixo | Foco hiperlocal e UX superior para PMEs sem RH |
| Custo de IA em escala | Médio | Médio | Limitar chamadas por plano; cache de embeddings; prompt caching |
| Dificuldade de monetizar candidatos | Médio | Médio | Manter candidatos sempre gratuitos; receita vem dos empregadores |

---

## 11. Próximos Passos

1. [ ] Validar nome "UbaJob" e paleta de cores com potenciais usuários
2. [ ] Entrevistar 10 empregadores locais para validar disposição de pagamento
3. [ ] Criar protótipo no Figma dos 3 fluxos principais
4. [ ] Teste de usabilidade com 5 usuários de cada persona
5. [ ] Definir stack definitiva e iniciar Fase 0 do desenvolvimento
6. [ ] Registrar domínio `ubajob.com.br`

---

*Documento gerado em abril de 2026. Versão 1.0 — sujeito a revisões com base em validação de mercado.*
