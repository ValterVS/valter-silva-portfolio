import type { Localized } from "@/i18n/config";

// professional: usado em trabalho · projects: usado nos meus projetos · studies: cursos e estudos
export type Usage = "professional" | "projects" | "studies";

export type Skill = { name: string; usage: Usage[] };

export type SkillGroup = {
  title: Localized;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: { pt: "Backend", en: "Backend" },
    skills: [
      { name: "Java", usage: ["professional","projects", "studies"] },
      { name: "Spring Boot", usage: ["professional","projects", "studies"] },
      { name: "Spring Security", usage: ["professional","projects"] },
      { name: "Spring Data JPA", usage: ["professional","projects"] },
      { name: "Node.js", usage: ["professional","projects", "studies"] },
      { name: "Express", usage: ["projects", "studies"] },
      { name: "REST APIs", usage: ["professional","projects", "studies"] },
    ],
  },
  {
    title: { pt: "Frontend", en: "Frontend" },
    skills: [
      { name: "React", usage: ["professional", "projects", "studies"] },
      { name: "JavaScript", usage: ["professional", "projects", "studies"] },
      { name: "TypeScript", usage: ["professional","projects"] },
      { name: "Next.js", usage: ["professional","projects"] },
      { name: "HTML", usage: ["professional","projects", "studies"] },
      { name: "CSS", usage: ["professional","projects", "studies"] },
    ],
  },
  {
    title: { pt: "Banco de dados", en: "Database" },
    skills: [
      { name: "PostgreSQL", usage: ["professional","projects", "studies"] },
      { name: "MySQL", usage: ["professional","projects"] },
      { name: "SQL Server", usage: ["professional"] },
      { name: "SQL", usage: ["professional", "projects", "studies"] },
      { name: "Flyway", usage: ["projects"] },
    ],
  },
  {
    title: { pt: "DevOps / Infra", en: "DevOps / Infra" },
    skills: [
      { name: "Docker", usage: ["projects"] },
      { name: "Docker Compose", usage: ["projects"] },
      { name: "Git", usage: ["professional","projects"] },
      { name: "GitHub", usage: ["professional","projects"] },
      { name: "Testcontainers", usage: ["projects"] },
      { name: "AWS", usage: ["studies"] },
    ],
  },
  {
    title: { pt: "Automação / IA", en: "Automation / AI" },
    skills: [
      { name: "n8n", usage: ["professional"] },
      { name: "AI integrations", usage: ["projects"] },
    ],
  },
  {
    title: { pt: "Suporte e operações", en: "Support & Operations" },
    skills: [
      { name: "IT Support", usage: ["professional"] },
      { name: "Infrastructure", usage: ["professional"] },
      { name: "Troubleshooting", usage: ["professional"] },
      { name: "Incident Management", usage: ["professional"] },
      { name: "Root Cause Analysis", usage: ["professional"] },
    ],
  },
  {
    title: { pt: "Outros", en: "Other" },
    skills: [
      { name: "Python", usage: ["studies"] },
      { name: "PHP", usage: ["projects"] },
      { name: "Unity", usage: ["projects"] },
    ],
  },
];
