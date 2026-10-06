import type { Locale } from "./config";

// Textos de interface da versão imersiva (/v2). O conteúdo profissional continua em src/data.
const pt = {
  meta: {
    title: "Valter da Silva | Software Developer",
  },
  nav: {
    about: "Sobre",
    work: "Trabalhos",
    contact: "Contato",
    menu: "Menu",
    close: "Fechar",
    language: "Idioma",
    main: "Navegação principal",
  },
  loading: "Carregando experiência",
  resume: "Currículo",
  hero: {
    greeting: "Olá, eu sou",
    side: "Backend Developer",
    scroll: "Role para explorar",
    stackLabel: "Tecnologias principais",
  },
  about: {
    eyebrow: "Sobre mim",
    education: "Formação",
    focus: "Foco",
    location: "Base",
  },
  stack: {
    eyebrow: "Stack",
    title: "Ferramentas que uso para construir",
    intro: "Cada tecnologia mostra onde foi usada: no trabalho, nos projetos ou nos estudos.",
  },
  experience: {
    eyebrow: "Experiência",
    present: "Atual",
  },
  work: {
    eyebrow: "Trabalhos",
    title: "Projetos selecionados",
    all: "Todos os projetos",
    viewAll: "Ver todos os repositórios",
  },
  education: {
    eyebrow: "Formação",
    courses: "Cursos",
  },
  contact: {
    eyebrow: "Contato",
    title: "Vamos conversar?",
    text: "Aberto a oportunidades em desenvolvimento de software, principalmente backend.",
    copy: "Copiar e-mail",
    copied: "E-mail copiado",
  },
  footer: {
    top: "Voltar ao topo",
    classic: "Versão clássica",
  },
};

export type ImmersiveDictionary = typeof pt;

const en: ImmersiveDictionary = {
  meta: {
    title: "Valter da Silva | Software Developer",
  },
  nav: {
    about: "About",
    work: "Work",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    language: "Language",
    main: "Main navigation",
  },
  loading: "Loading experience",
  resume: "Resume",
  hero: {
    greeting: "Hi, I'm",
    side: "Backend Developer",
    scroll: "Scroll to explore",
    stackLabel: "Core technologies",
  },
  about: {
    eyebrow: "About me",
    education: "Education",
    focus: "Focus",
    location: "Based in",
  },
  stack: {
    eyebrow: "Stack",
    title: "Tools I build with",
    intro: "Each technology shows where it was used: at work, in projects or in studies.",
  },
  experience: {
    eyebrow: "Experience",
    present: "Present",
  },
  work: {
    eyebrow: "Work",
    title: "Selected projects",
    all: "All projects",
    viewAll: "View all repositories",
  },
  education: {
    eyebrow: "Education",
    courses: "Courses",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk.",
    text: "Open to software development opportunities, especially backend.",
    copy: "Copy email",
    copied: "Email copied",
  },
  footer: {
    top: "Back to top",
    classic: "Classic version",
  },
};

const dictionaries: Record<Locale, ImmersiveDictionary> = { pt, en };

export function getImmersiveDictionary(locale: Locale) {
  return dictionaries[locale];
}
