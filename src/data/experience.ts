import type { Localized } from "@/i18n/config";

export type Experience = {
  company: string;
  role: string;
  kind: "development" | "support";
  client?: string;
  // Formato AAAA-MM; end vazio significa emprego atual
  start: string;
  end?: string;
  period: Localized;
  summary: Localized;
  highlights: Localized<string[]>;
  tags: string[];
};

// Experiências profissionais, da mais recente para a mais antiga.
export const experience: Experience[] = [
  {
    company: "Solutis Tecnologias",
    role: "Customer Support Analyst II",
    kind: "support",
    client: "SABESP",
    start: "2026-01",
    end: "2026-06",
    period: {
      pt: "Janeiro de 2026 — Junho de 2026",
      en: "January 2026 — June 2026",
    },
    summary: {
      pt: "Suporte técnico especializado de segundo nível (L2) para a SABESP, com foco em resolução de incidentes, infraestrutura de TI e estabilidade dos sistemas.",
      en: "Specialized second-level (L2) technical support for SABESP, focused on incident resolution, IT infrastructure and system stability.",
    },
    highlights: {
      pt: [
        "Resolução de incidentes técnicos como suporte de segundo nível (L2), de ponta a ponta e dentro dos SLAs.",
        "Investigação de causa raiz dos problemas reportados.",
        "Suporte a ativos e à infraestrutura de rede, com foco na estabilidade dos sistemas.",
      ],
      en: [
        "Resolved technical incidents as second-level (L2) support, end to end and within SLAs.",
        "Investigated the root cause of reported issues.",
        "Supported IT assets and network infrastructure, focused on system stability.",
      ],
    },
    tags: ["IT Support", "Infrastructure", "Troubleshooting", "Incident Management", "Root Cause Analysis"],
  },
  {
    company: "Linx",
    role: "Junior Software Developer",
    kind: "development",
    start: "2025-09",
    end: "2025-11",
    period: {
      pt: "Setembro de 2025 — Novembro de 2025",
      en: "September 2025 — November 2025",
    },
    summary: {
      pt: "Desenvolvimento de soluções web para clínicas odontológicas, envolvendo agendamento, procedimentos e registros clínicos.",
      en: "Built web solutions for dental clinics, covering scheduling, procedures and clinical records.",
    },
    highlights: {
      pt: [
        "Funcionalidades web para clínicas odontológicas: agendamento, procedimentos e registros clínicos.",
        "Interfaces em React com dados em SQL Server.",
        "Integrações e automação de fluxos com n8n.",
      ],
      en: [
        "Web features for dental clinics: scheduling, procedures and clinical records.",
        "React interfaces backed by SQL Server.",
        "Integrations and workflow automation with n8n.",
      ],
    },
    tags: ["Java","Spring","NodeJS", "Typescript", "SQL Server", "n8n"],
  },
];
