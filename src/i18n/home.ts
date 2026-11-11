import type { Locale } from "./config";

// Textos de interface da home editorial. Conteúdo profissional (apresentação, sobre,
// experiência, projetos) continua em src/data; aqui ficam rótulos e frases da página.
const pt = {
  nav: {
    label: "Navegação principal",
    projects: "Projetos",
    experience: "Experiência",
    about: "Sobre",
    contact: "Contato",
    language: "Idioma",
    resume: "Baixar currículo (PDF)",
    resumeShort: "Currículo (PDF)",
  },
  intro: {
    title: "Olá, eu sou o Valter.",
    role: "Desenvolvedor de Software",
    projects: "Ver projetos",
    github: "GitHub",
  },
  projects: {
    title: "Projetos selecionados",
    details: "Ver detalhes",
    detailsOf: "Ver detalhes de",
    code: "Código",
    stack: "Tecnologias principais",
  },
  experience: {
    title: "Experiência",
    client: "Cliente",
  },
  about: {
    title: "Sobre",
    education: "Formação",
    courses: "Cursos",
    skills: "Tecnologias com que trabalho",
    location: "Lins, São Paulo",
  },
  contact: {
    title: "Contato",
    text: "Procuro uma vaga júnior em desenvolvimento backend com Java e também tenho interesse em posições full-stack. Para conversar, o melhor caminho é o e-mail.",
    email: "E-mail",
    resume: "Currículo",
    resumeLink: "Baixar PDF",
  },
  footer: {
    top: "Voltar ao topo",
  },
  project: {
    back: "Todos os projetos",
    page: "Página completa",
    close: "Fechar",
    code: "Código no GitHub",
    live: "Ver projeto",
    problem: "Problema",
    solution: "Solução",
    decisions: "Decisões técnicas",
    role: "Minha participação",
    features: "Funcionalidades",
    challenges: "Desafios técnicos",
    learnings: "Aprendizados",
    stack: "Tecnologias",
    planned: "Planejado",
    authors: "Autoria",
    gallery: "Capturas de tela",
    previous: "Imagem anterior",
    next: "Próxima imagem",
  },
};

export type HomeDictionary = typeof pt;

const en: HomeDictionary = {
  nav: {
    label: "Main navigation",
    projects: "Projects",
    experience: "Experience",
    about: "About",
    contact: "Contact",
    language: "Language",
    resume: "Download résumé (PDF)",
    resumeShort: "Résumé (PDF)",
  },
  intro: {
    title: "Hi, I'm Valter.",
    role: "Software Developer",
    projects: "See projects",
    github: "GitHub",
  },
  projects: {
    title: "Selected projects",
    details: "View details",
    detailsOf: "View details of",
    code: "Code",
    stack: "Main technologies",
  },
  experience: {
    title: "Experience",
    client: "Client",
  },
  about: {
    title: "About",
    education: "Education",
    courses: "Courses",
    skills: "What I work with",
    location: "Lins, São Paulo, Brazil",
  },
  contact: {
    title: "Contact",
    text: "I'm looking for a junior backend role working with Java, and I'm open to full-stack positions as well. Email is the best way to reach me.",
    email: "Email",
    resume: "Résumé",
    resumeLink: "Download PDF",
  },
  footer: {
    top: "Back to top",
  },
  project: {
    back: "All projects",
    page: "Full page",
    close: "Close",
    code: "Code on GitHub",
    live: "View project",
    problem: "Problem",
    solution: "Solution",
    decisions: "Technical decisions",
    role: "My role",
    features: "Features",
    challenges: "Technical challenges",
    learnings: "Learnings",
    stack: "Technologies",
    planned: "Planned",
    authors: "Authors",
    gallery: "Screenshots",
    previous: "Previous image",
    next: "Next image",
  },
};

const dictionaries: Record<Locale, HomeDictionary> = { pt, en };

export function getHomeDictionary(locale: Locale) {
  return dictionaries[locale];
}
