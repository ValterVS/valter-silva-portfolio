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
      { name: "Maven", usage: ["projects"] },
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

export type StackTier = "core" | "tools" | "additional";

// Peso de cada tecnologia na home: o núcleo backend em destaque, o restante em camadas mais discretas.
// Os nomes precisam existir em skillGroups (de lá vem onde cada uma foi usada).
export const stackTiers: Record<StackTier, string[]> = {
  core: ["Java", "Spring Boot", "REST APIs", "PostgreSQL", "SQL", "Git"],
  tools: ["Spring Data JPA", "Spring Security", "Flyway", "Testcontainers", "Docker", "Docker Compose", "Maven", "GitHub"],
  additional: ["React", "TypeScript", "JavaScript", "Node.js", "Express", "Next.js", "MySQL", "SQL Server", "n8n", "Python", "PHP", "Unity", "AWS"],
};

// Tecnologias essenciais exibidas na home, em grupos curtos e sem níveis de domínio.
// Cada item precisa ter uso comprovado em experiência ou projeto listado no site.
export const essentialSkills: { group: Localized; items: Localized<string[]> }[] = [
  {
    group: { pt: "Backend", en: "Backend" },
    items: { pt: ["Java", "Spring Boot", "PostgreSQL"], en: ["Java", "Spring Boot", "PostgreSQL"] },
  },
  {
    group: { pt: "Front-end", en: "Front end" },
    items: { pt: ["React", "TypeScript", "Next.js"], en: ["React", "TypeScript", "Next.js"] },
  },
  {
    group: { pt: "Ferramentas e qualidade", en: "Tooling and quality" },
    items: { pt: ["Git", "Docker", "testes automatizados"], en: ["Git", "Docker", "automated testing"] },
  },
  {
    group: { pt: "IA aplicada", en: "Applied AI" },
    items: { pt: ["integração de modelos de IA em aplicações"], en: ["integrating AI models into applications"] },
  },
];
