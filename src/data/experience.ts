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
        "Atendimento e resolução de incidentes técnicos como suporte especializado de segundo nível.",
        "Investigação de causa raiz dos problemas reportados.",
        "Suporte a ativos e à infraestrutura de rede.",
        "Acompanhamento de chamados de ponta a ponta, seguindo os SLAs acordados.",
      ],
      en: [
        "Handled and resolved technical incidents as specialized second-level support.",
        "Investigated the root cause of reported issues.",
        "Supported IT assets and network infrastructure.",
        "Followed tickets end to end within the agreed SLAs.",
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
        "Desenvolvimento e manutenção de funcionalidades web para clínicas odontológicas.",
        "Fluxos de agendamento, procedimentos e registros médicos.",
        "Integração e automação de workflows com n8n.",
        "Interfaces em React e dados em SQL Server.",
      ],
      en: [
        "Developed and maintained web features for dental clinics.",
        "Worked on scheduling, procedure and medical record flows.",
        "Integrated and automated workflows with n8n.",
        "Built React interfaces backed by SQL Server.",
      ],
    },
    tags: ["React", "JavaScript", "SQL Server", "n8n"],
  },
];
