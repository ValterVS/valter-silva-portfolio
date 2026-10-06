import type { Localized } from "@/i18n/config";

export type Education = {
  institution: string;
  shortName: string;
  course: Localized;
  status: Localized;
  location: Localized;
  // Preencha só quando a data estiver confirmada (ex.: "2026"). Sem valor, não aparece.
  conclusion?: string;
};

export type Course = {
  title: string;
  instructor: string;
  topics: string[];
};

export const education: Education[] = [
  {
    institution: "Unilins — Centro Universitário de Lins",
    shortName: "Unilins",
    course: { pt: "Engenharia de Software", en: "Software Engineering" },
    status: {
      pt: "10º semestre · fase final da graduação",
      en: "10th semester · final stage of the degree",
    },
    location: { pt: "Lins, São Paulo, Brasil", en: "Lins, São Paulo, Brazil" },
  },
];

export const courses: Course[] = [
  {
    title: "Full-Stack Web Development Bootcamp",
    instructor: "Dr. Angela Yu",
    topics: ["React", "Node.js", "Express.js", "PostgreSQL", "Web Development", "Software Engineering fundamentals"],
  },
  {
    title: "Java: do iniciante ao profissional",
    instructor: "Leonardo Moura",
    topics: ["Java", "Spring Boot", "CRUD", "Database Applications", "Backend Development"],
  },
];
