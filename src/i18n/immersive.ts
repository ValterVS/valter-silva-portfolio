import type { Locale } from "./config";

// Textos de interface da home (versão imersiva). O conteúdo profissional continua em src/data.
const pt = {
  meta: {
    title: "Valter da Silva | Software Developer",
  },
  nav: {
    about: "Sobre",
    work: "Projetos",
    contact: "Contato",
    menu: "Menu",
    close: "Fechar",
    language: "Idioma",
    main: "Navegação principal",
  },
  resume: "Currículo",
  hero: {
    greeting: "Olá, eu sou",
    side: "Backend Developer",
    scroll: "Role para explorar",
    stackLabel: "Tecnologias principais",
    portraitAlt: "Retrato de Valter da Silva",
    projects: "Ver projetos",
    contact: "Contato",
  },
  about: {
    eyebrow: "Sobre mim",
    education: "Formação",
    focus: "Foco",
    location: "Base",
  },
  stack: {
    eyebrow: "Stack",
    title: "Backend com Java e Spring Boot",
    intro: "O núcleo do meu trabalho, as ferramentas ao redor dele e o que já usei em outros contextos.",
    tiers: {
      core: "Core stack",
      tools: "Ferramentas e ecossistema",
      additional: "Experiência adicional",
    },
  },
  experience: {
    eyebrow: "Experiência",
    present: "Atual",
  },
  work: {
    eyebrow: "Projetos",
    title: "Projetos em destaque",
    others: "Outros projetos",
    viewAll: "Ver todos os repositórios",
    open: "Ver detalhes",
    drawer: {
      problem: "Problema",
      solution: "Solução",
      role: "Minha participação",
      stack: "Tecnologias",
      live: "Ver projeto",
      page: "Página completa",
      close: "Fechar",
      previous: "Imagem anterior",
      next: "Próxima imagem",
      gallery: "Capturas de tela",
      placeholder: "Captura de tela em breve",
    },
  },
  education: {
    eyebrow: "Formação",
    courses: "Cursos",
  },
  contact: {
    eyebrow: "Contato",
    title: "Vamos construir algo?",
    text: "Aberto a oportunidades em desenvolvimento de software, principalmente backend com Java e Spring Boot.",
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
    work: "Projects",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    language: "Language",
    main: "Main navigation",
  },
  resume: "Resume",
  hero: {
    greeting: "Hi, I'm",
    side: "Backend Developer",
    scroll: "Scroll to explore",
    stackLabel: "Core technologies",
    portraitAlt: "Portrait of Valter da Silva",
    projects: "View projects",
    contact: "Contact",
  },
  about: {
    eyebrow: "About me",
    education: "Education",
    focus: "Focus",
    location: "Based in",
  },
  stack: {
    eyebrow: "Stack",
    title: "Backend with Java and Spring Boot",
    intro: "The core of my work, the tools around it and what I've used in other contexts.",
    tiers: {
      core: "Core stack",
      tools: "Tools & ecosystem",
      additional: "Additional experience",
    },
  },
  experience: {
    eyebrow: "Experience",
    present: "Present",
  },
  work: {
    eyebrow: "Projects",
    title: "Featured projects",
    others: "Other projects",
    viewAll: "View all repositories",
    open: "View details",
    drawer: {
      problem: "Problem",
      solution: "Solution",
      role: "My role",
      stack: "Technologies",
      live: "View project",
      page: "Full page",
      close: "Close",
      previous: "Previous image",
      next: "Next image",
      gallery: "Screenshots",
      placeholder: "Screenshot coming soon",
    },
  },
  education: {
    eyebrow: "Education",
    courses: "Courses",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's build something together.",
    text: "Open to software development opportunities, especially backend with Java and Spring Boot.",
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
