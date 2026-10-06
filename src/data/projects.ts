import type { Localized } from "@/i18n/config";

export type ProjectCategory = "backend" | "fullstack" | "ai" | "games" | "academic";
export type ProjectStatus = "in-progress" | "completed" | "mvp";

export type ProjectDetails = {
  problem?: Localized;
  solution?: Localized;
  architecture?: Localized<string[]>;
  features?: Localized<string[]>;
  challenges?: Localized<string[]>;
  learnings?: Localized<string[]>;
};

export type Project = {
  slug: string;
  title: string | Localized;
  description: Localized;
  categories: ProjectCategory[];
  status?: ProjectStatus;
  technologies: string[];
  plannedTechnologies?: string[];
  github?: string;
  live?: string;
  // Capa do card. Coloque a imagem em public/projects/<slug>/ e informe o caminho, ex.: "/projects/eitanol/cover.png".
  // Sem imagem, o card usa uma capa gerada.
  image?: string;
  screenshots?: string[];
  featured?: boolean;
  year?: string;
  authors?: string;
  // Com details preenchido, o projeto ganha a página /projects/<slug>.
  details?: ProjectDetails;
};

// Adicione novos projetos nesta lista. A ordem aqui é a ordem no site.
export const projects: Project[] = [
  {
    slug: "orca-ai",
    title: "Orça Aí",
    description: {
      pt: "SaaS multiempresa para orçamentos e propostas, começando por empresas de obras e reformas. Backend em Spring Boot com isolamento de dados entre empresas e autenticação por sessão.",
      en: "Multi-tenant SaaS for estimates and proposals, starting with construction and renovation companies. Spring Boot backend with per-company data isolation and session-based authentication.",
    },
    categories: ["backend", "fullstack"],
    status: "in-progress",
    featured: true,
    technologies: [
      "Java 25",
      "Spring Boot 4",
      "Spring Security",
      "Spring Session JDBC",
      "Spring Data JPA",
      "PostgreSQL",
      "Flyway",
      "Testcontainers",
      "Next.js",
      "TypeScript",
      "Vitest",
      "Docker Compose",
    ],
    github: "https://github.com/ValterVS/OrcaAi",
    details: {
      problem: {
        pt: "Empresas de obras e reformas precisam organizar clientes, orçamentos, propostas e serviços em um só lugar, com a equipe trabalhando sobre os mesmos dados.",
        en: "Construction and renovation companies need to keep customers, estimates, proposals and services in one place, with the whole team working on the same data.",
      },
      solution: {
        pt: "Uma plataforma SaaS em que cada empresa tem sua conta e sua equipe. A base atual cobre cadastro da empresa, autenticação, gestão de equipe e o primeiro módulo de negócio — clientes. Orçamentos e propostas são os próximos módulos.",
        en: "A SaaS platform where each company has its own account and team. The current foundation covers company signup, authentication, team management and the first business module — customers. Estimates and proposals are the next modules.",
      },
      architecture: {
        pt: [
          "Monólito modular em Spring Boot: identity, organizations, users, customers e team são pacotes com fronteiras claras, que se referenciam por ID e não por associação JPA.",
          "Multi-tenancy em banco compartilhado: a empresa vem apenas da sessão autenticada, o Hibernate filtra por @TenantId e o PostgreSQL aplica Row Level Security.",
          "Sessão no servidor com Spring Session JDBC em vez de JWT, cookies HttpOnly e proteção CSRF double-submit.",
          "O frontend Next.js fala só com a própria origem; /api é roteado ao backend, sem CORS. Erros seguem a RFC 9457 (problem+json).",
        ],
        en: [
          "Modular monolith in Spring Boot: identity, organizations, users, customers and team are packages with clear boundaries that reference each other by ID, not JPA associations.",
          "Shared-database multi-tenancy: the company comes only from the authenticated session, Hibernate filters by @TenantId and PostgreSQL enforces Row Level Security.",
          "Server-side sessions with Spring Session JDBC instead of JWT, HttpOnly cookies and double-submit CSRF protection.",
          "The Next.js frontend only talks to its own origin; /api is routed to the backend, with no CORS. Errors follow RFC 9457 (problem+json).",
        ],
      },
      features: {
        pt: [
          "Cadastro da empresa com usuário OWNER e confirmação de e-mail.",
          "Login, logout, recuperação e redefinição de senha com tokens de uso único.",
          "Equipe com convites, papéis OWNER / ADMIN / MEMBER, desativação e reativação de usuários.",
          "Clientes: cadastro, busca paginada, edição, arquivamento e restauração, com controle de concorrência via ETag e If-Match.",
          "Rate limit de login por endereço e por conta.",
        ],
        en: [
          "Company signup with an OWNER user and email verification.",
          "Login, logout, password recovery and reset with single-use tokens.",
          "Team management with invitations, OWNER / ADMIN / MEMBER roles, user deactivation and reactivation.",
          "Customers: create, paginated search, edit, archive and restore, with concurrency control through ETag and If-Match.",
          "Login rate limiting per address and per account.",
        ],
      },
      challenges: {
        pt: [
          "Garantir que uma empresa nunca acesse dados de outra, mesmo conhecendo o UUID exato do registro — coberto por testes de isolamento entre tenants.",
          "Tokens de e-mail de uso único sob concorrência: o consumo é um UPDATE … RETURNING atômico no PostgreSQL, testado com várias threads.",
          "Evitar enumeração de contas: cadastro e recuperação de senha respondem sempre da mesma forma, com o mesmo custo de BCrypt.",
          "Testes de integração contra um PostgreSQL real com Testcontainers e migrations versionadas com Flyway.",
        ],
        en: [
          "Making sure a company can never reach another company's data, even knowing the record's exact UUID — covered by cross-tenant isolation tests.",
          "Single-use email tokens under concurrency: consumption is an atomic UPDATE … RETURNING in PostgreSQL, tested with multiple threads.",
          "Preventing account enumeration: signup and password recovery always respond the same way, with the same BCrypt cost.",
          "Integration tests against a real PostgreSQL with Testcontainers and versioned migrations with Flyway.",
        ],
      },
    },
  },
  {
    slug: "eitanol",
    title: "EiTanol",
    description: {
      pt: "Plataforma de comparação de preços de combustíveis por região, pensada para responder onde realmente compensa abastecer. Construída em etapas, com decisões de arquitetura registradas em ADRs.",
      en: "Fuel price comparison platform by region, designed to answer where it actually pays to fill up. Built in stages, with architecture decisions recorded as ADRs.",
    },
    categories: ["backend", "fullstack"],
    status: "in-progress",
    featured: true,
    technologies: ["Java 25", "Spring Boot 4", "PostgreSQL", "PostGIS", "Docker Compose", "Next.js", "TypeScript", "Tailwind CSS", "JUnit"],
    plannedTechnologies: ["Spring Data JPA", "Flyway", "Testcontainers"],
    github: "https://github.com/ValterVS/Eitanol",
    details: {
      problem: {
        pt: "Muita gente abastece sempre no mesmo posto por hábito, sem saber se outro um pouco mais longe compensaria pelo preço. As informações de preço estão espalhadas, desatualizadas ou dependem de uma única fonte.",
        en: "Many drivers always fill up at the same station out of habit, without knowing whether one a little farther away would be worth it. Price information is scattered, outdated or depends on a single source.",
      },
      solution: {
        pt: "Agregar múltiplas fontes de preço e transformar isso em uma decisão simples: localizar postos, consultar preços por tipo de combustível e comparar as opções, considerando preço e distância.",
        en: "Aggregate multiple price sources and turn them into a simple decision: find stations, check prices by fuel type and compare options, considering price and distance.",
      },
      architecture: {
        pt: [
          "Monólito modular em Spring Boot, organizado por domínio (station, price, location, user, vehicle…), sem microsserviços antes de existir necessidade.",
          "PostgreSQL com PostGIS para buscas geográficas, como postos próximos e distância até o usuário.",
          "Múltiplas fontes de preço previstas desde o modelo de dados: cada observação guarda a origem e o nível de confiança.",
          "Monorepo com backend, web, docs e infra; ambiente local com Docker Compose.",
        ],
        en: [
          "Modular monolith in Spring Boot, organized by domain (station, price, location, user, vehicle…), with no microservices before there is a need for them.",
          "PostgreSQL with PostGIS for geographic queries such as nearby stations and distance to the user.",
          "Multiple price sources supported from the data model up: each observation stores its source and confidence level.",
          "Monorepo with backend, web, docs and infra; local environment with Docker Compose.",
        ],
      },
      features: {
        pt: [
          "Fundação concluída: backend Spring Boot com health check, frontend Next.js e PostgreSQL + PostGIS via Docker Compose.",
          "Modelagem do domínio com Station, FuelType, PriceSource, PriceConfidence e PriceObservation como classes imutáveis, cobertas por testes unitários.",
          "Histórico de preços preservado: uma observação nunca é sobrescrita.",
          "Roadmap público em etapas, da integração com dados da ANP até um aplicativo mobile.",
        ],
        en: [
          "Foundation complete: Spring Boot backend with a health check, Next.js frontend and PostgreSQL + PostGIS via Docker Compose.",
          "Domain model with Station, FuelType, PriceSource, PriceConfidence and PriceObservation as immutable classes covered by unit tests.",
          "Price history preserved: an observation is never overwritten.",
          "Public, staged roadmap, from ANP data integration to a mobile app.",
        ],
      },
      challenges: {
        pt: [
          "Modelar preço como uma observação histórica com fonte e confiança, e não como um campo do posto.",
          "Adiar ferramentas como Redis, filas e observabilidade até haver necessidade real, registrando cada decisão em ADRs.",
        ],
        en: [
          "Modeling price as a historical observation with source and confidence, rather than a field on the station.",
          "Deferring tools like Redis, queues and observability until there is a real need, recording each decision in ADRs.",
        ],
      },
    },
  },
  {
    slug: "jurimetria-ia",
    title: { pt: "Jurimetria IA", en: "Jurimetria AI" },
    description: {
      pt: "Trabalho de conclusão de curso: sistema para acompanhar processos judiciais que usa IA para extrair um resumo estruturado de sentenças e acórdãos e alimentar um painel de jurimetria.",
      en: "Capstone project: a system for tracking court cases that uses AI to extract structured summaries from rulings and feed a jurimetrics dashboard.",
    },
    categories: ["fullstack", "ai", "academic"],
    status: "mvp",
    featured: true,
    year: "2026",
    authors: "Valter Silva, Marcelo Cruz Caceraghi",
    technologies: ["Node.js", "Express", "PostgreSQL", "React", "Vite", "Tailwind CSS", "Zod", "Anthropic API", "Recharts"],
    github: "https://github.com/ValterVS/jurimetria-ia",
    details: {
      problem: {
        pt: "Escritórios e departamentos jurídicos precisam acompanhar processos e entender resultados históricos por tribunal, comarca, vara, julgador e tipo de pedido — informação que está no texto das decisões.",
        en: "Law firms and legal departments need to track cases and understand historical outcomes by court, district, judge and type of claim — information that lives inside the text of the rulings.",
      },
      solution: {
        pt: "Cadastro de processos, partes e pedidos; envio do texto da decisão para análise por IA com saída estruturada; e um painel de jurimetria calculado pelo banco de dados. Princípio central: a IA lê um documento por vez e nunca calcula estatística.",
        en: "Case, party and claim management; ruling text sent for AI analysis with structured output; and a jurimetrics dashboard computed by the database. Core principle: the AI reads one document at a time and never computes statistics.",
      },
      architecture: {
        pt: [
          "Frontend React + Vite → API Node.js/Express → PostgreSQL. A chave da IA existe apenas no backend.",
          "Backend em camadas (routes → controllers → services → repositories) e uma camada de IA isolada, o que permitiu trocar de provedor sem tocar em controllers e services.",
          "Análise assíncrona: o registro é criado como Pendente antes da chamada externa, a API responde 202 e o frontend acompanha o status por polling.",
          "Structured Outputs com schema Zod, validado novamente no backend antes de persistir.",
        ],
        en: [
          "React + Vite frontend → Node.js/Express API → PostgreSQL. The AI key exists only on the backend.",
          "Layered backend (routes → controllers → services → repositories) plus an isolated AI layer, which made it possible to switch providers without touching controllers or services.",
          "Asynchronous analysis: the record is created as Pending before the external call, the API answers 202 and the frontend polls the status.",
          "Structured Outputs with a Zod schema, validated again on the backend before persisting.",
        ],
      },
      features: {
        pt: [
          "CRUD de processos, partes, pedidos, sentenças e acórdãos, além de catálogos auxiliares (tribunais, comarcas, varas, julgadores).",
          "Upload de decisões em PDF e DOCX com extração de texto.",
          "Anonimização (LGPD) de CPF, CNPJ, e-mail, telefone, CEP, RG e dados bancários antes de qualquer envio à IA.",
          "Painel de jurimetria por julgador, por pedido e por tribunal.",
        ],
        en: [
          "CRUD for cases, parties, claims, rulings and appellate decisions, plus supporting catalogs (courts, districts, judges).",
          "PDF and DOCX ruling upload with text extraction.",
          "Anonymization (LGPD) of CPF, CNPJ, email, phone, postal code, ID and banking data before anything is sent to the AI.",
          "Jurimetrics dashboard by judge, by claim and by court.",
        ],
      },
      challenges: {
        pt: [
          "Nenhuma decisão fica sem análise registrada: se a chamada à IA falha, o status vira Erro com log e o usuário pode tentar de novo.",
          "Separar leitura semântica (IA) de agregação (SQL), para que os números sejam sempre estatística descritiva e auditável.",
          "Testes automatizados com node:test que não chamam a API real nem exigem um banco rodando.",
        ],
        en: [
          "No ruling is left without a recorded analysis: if the AI call fails, the status becomes Error with a log and the user can retry.",
          "Separating semantic reading (AI) from aggregation (SQL), so the numbers are always descriptive, auditable statistics.",
          "Automated tests with node:test that never call the real API or require a running database.",
        ],
      },
    },
  },
  {
    slug: "forest-of-the-fallen",
    title: "Forest of the Fallen",
    description: {
      pt: "Jogo 3D desenvolvido em Unity, com sistemas de combate, inimigos com IA, controle do jogador e animações.",
      en: "3D game built in Unity, with combat systems, AI-driven enemies, player controllers and animations.",
    },
    categories: ["games"],
    featured: true,
    technologies: ["Unity"],
  },
  {
    slug: "pro-ai-proposals",
    title: "Pro AI Proposals",
    description: {
      pt: "Projeto na área de inteligência artificial. Os detalhes serão publicados junto com o repositório.",
      en: "Artificial intelligence project. Details will be published along with the repository.",
    },
    categories: ["ai"],
    technologies: [],
  },
  {
    slug: "tcg-campeoes",
    title: "TCG Campeões",
    description: {
      pt: "Projeto em desenvolvimento. Os detalhes serão publicados junto com o repositório.",
      en: "Project in development. Details will be published along with the repository.",
    },
    categories: [],
    status: "in-progress",
    technologies: [],
  },
  {
    slug: "ta-barato",
    title: "Tá Barato",
    description: {
      pt: "Pesquisa de preços de produtos em mercados, com dados inseridos pelos próprios estabelecimentos. Cada busca mostra o mercado mais barato no topo.",
      en: "Product price search across supermarkets, with data entered by the stores themselves. Every search shows the cheapest store first.",
    },
    categories: ["academic"],
    year: "2023",
    technologies: ["PHP", "MySQL / MariaDB", "JavaScript", "HTML", "CSS"],
    github: "https://github.com/ValterVS/tabarato",
    details: {
      features: {
        pt: [
          "Busca por produto com os mercados ordenados do mais barato para o mais caro.",
          "Área do mercado para atualizar preço e estoque dos próprios produtos.",
          "Área administrativa para editar e excluir mercados.",
          "Triggers no banco: a data é atualizada a cada mudança de preço e novos mercados já nascem com o catálogo de produtos.",
          "Formatação e validação de CNPJ no cadastro.",
        ],
        en: [
          "Product search with stores sorted from cheapest to most expensive.",
          "Store area to update the price and stock of its own products.",
          "Admin area to edit and delete stores.",
          "Database triggers: the date updates on every price change and new stores start with the product catalog.",
          "CNPJ formatting and validation on signup.",
        ],
      },
    },
  },
  {
    slug: "central-de-curriculos",
    title: "Central de Currículos",
    description: {
      pt: "Projeto acadêmico da Unilins para aproximar empresas de alunos em fase final ou já formados, com cadastro e gestão de currículos.",
      en: "Academic project at Unilins connecting companies with students close to graduating or already graduated, through résumé registration and management.",
    },
    categories: ["academic"],
    year: "2023",
    technologies: ["PHP", "MySQL / MariaDB", "JavaScript", "HTML", "CSS"],
    github: "https://github.com/ValterVS/Central-de-Curriculos",
    details: {
      features: {
        pt: [
          "Listagem pública dos alunos com currículo preenchido: nome, curso e tipo de vaga desejada.",
          "Cadastro, login, edição e exclusão do próprio currículo.",
          "Experiência profissional e qualificações técnicas como campos opcionais.",
        ],
        en: [
          "Public list of students with a completed résumé: name, course and desired position type.",
          "Signup, login, editing and deletion of one's own résumé.",
          "Professional experience and technical skills as optional fields.",
        ],
      },
    },
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
