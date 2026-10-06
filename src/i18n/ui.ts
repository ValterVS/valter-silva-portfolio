import type { Locale } from "./config";

// Textos fixos da interface. O conteúdo (experiências, projetos etc.) fica em src/data.
const pt = {
  meta: {
    title: "Valter da Silva | Software Developer",
    description:
      "Valter da Silva, Software Developer e Backend Developer com Java e Spring Boot. Estudante de Engenharia de Software: projetos, experiência e contato.",
  },
  nav: {
    home: "Início",
    about: "Sobre",
    experience: "Experiência",
    skills: "Tecnologias",
    projects: "Projetos",
    education: "Formação",
    contact: "Contato",
  },
  actions: {
    viewProjects: "Ver projetos",
    downloadResume: "Baixar currículo",
    resume: "Currículo",
    contact: "Entrar em contato",
    viewGithub: "Ver GitHub",
    allRepos: "Ver todos os repositórios",
    details: "Detalhes",
    code: "Código",
    liveDemo: "Demo",
    backToProjects: "Voltar para projetos",
    copy: "Copiar",
    copied: "Copiado",
  },
  a11y: {
    skip: "Pular para o conteúdo",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    language: "Idioma",
    mainNav: "Navegação principal",
    sceneLabel:
      "Ilustração 3D de uma arquitetura de software: cliente, API, serviços, banco de dados e nuvem conectados por fluxos de dados.",
    backToTop: "Voltar ao topo",
  },
  hero: {
    greeting: "Olá, eu sou",
    roles: ["Software Developer", "Backend Developer", "Java Developer", "Software Engineer"],
    available: "Lins, SP · Brasil",
    featured: "Projetos em destaque",
  },
  sections: {
    about: { eyebrow: "Sobre", title: "Engenharia de software com os pés no chão" },
    experience: { eyebrow: "Experiência", title: "Onde já trabalhei" },
    skills: {
      eyebrow: "Tecnologias",
      title: "Stack e ferramentas",
      intro:
        "Cada tecnologia indica onde foi usada. Nem tudo aqui é experiência profissional — e o site deixa isso claro.",
    },
    projects: {
      eyebrow: "Projetos",
      title: "O que estou construindo",
      intro: "Produtos em desenvolvimento, trabalhos acadêmicos e experimentos fora da web.",
    },
    education: { eyebrow: "Formação", title: "Graduação e cursos" },
    contact: {
      eyebrow: "Contato",
      title: "Vamos conversar",
      intro:
        "Aberto a oportunidades em desenvolvimento de software, principalmente backend. Mande uma mensagem ou me encontre nas redes abaixo.",
    },
  },
  about: {
    facts: {
      education: "Formação",
      focus: "Foco",
      location: "Localização",
    },
  },
  experience: {
    kind: { development: "Desenvolvimento", support: "Suporte e infraestrutura" },
    client: "Cliente",
  },
  skills: {
    usage: {
      professional: "Profissional",
      projects: "Projetos",
      studies: "Estudos",
    },
    legend: "Legenda",
  },
  projects: {
    filterLabel: "Filtrar projetos",
    filters: {
      all: "Todos",
      backend: "Backend",
      fullstack: "Full Stack",
      ai: "IA",
      games: "Games",
      academic: "Acadêmicos",
    },
    status: {
      "in-progress": "Em desenvolvimento",
      completed: "Concluído",
      mvp: "MVP funcional",
    },
    academic: "Projeto acadêmico",
    featured: "Destaque",
    others: "Outros projetos",
    empty: "Nenhum projeto nesta categoria por enquanto.",
    detail: {
      problem: "Problema",
      solution: "Solução",
      architecture: "Arquitetura",
      features: "Principais funcionalidades",
      technologies: "Tecnologias",
      planned: "Planejado",
      challenges: "Desafios técnicos",
      learnings: "Aprendizados",
      screenshots: "Capturas de tela",
      team: "Autoria",
      links: "Links",
    },
  },
  education: {
    courses: "Cursos e Qualificações",
    instructor: "Instrutor(a)",
  },
  contact: {
    email: "E-mail",
    location: "Localização",
    form: {
      name: "Nome",
      email: "Seu e-mail",
      message: "Mensagem",
      send: "Enviar mensagem",
      hint: "O envio abre seu aplicativo de e-mail com a mensagem preenchida.",
      subject: "Contato pelo portfólio",
    },
  },
  footer: {
    rights: "Todos os direitos reservados.",
  },
  notFound: {
    title: "Página não encontrada",
    text: "O endereço acessado não existe ou foi movido.",
    back: "Voltar ao início",
  },
};

export type Dictionary = typeof pt;

const en: Dictionary = {
  meta: {
    title: "Valter da Silva | Software Developer",
    description:
      "Valter da Silva, Software Developer and Backend Developer working with Java and Spring Boot. Software Engineering student: projects, experience and contact.",
  },
  nav: {
    home: "Home",
    about: "About",
    experience: "Experience",
    skills: "Technologies",
    projects: "Projects",
    education: "Education",
    contact: "Contact",
  },
  actions: {
    viewProjects: "View Projects",
    downloadResume: "Download Resume",
    resume: "Resume",
    contact: "Contact Me",
    viewGithub: "View GitHub",
    allRepos: "View all repositories",
    details: "Details",
    code: "Code",
    liveDemo: "Live Demo",
    backToProjects: "Back to projects",
    copy: "Copy",
    copied: "Copied",
  },
  a11y: {
    skip: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    mainNav: "Main navigation",
    sceneLabel:
      "3D illustration of a software architecture: client, API, services, database and cloud connected by data flows.",
    backToTop: "Back to top",
  },
  hero: {
    greeting: "Hi, I'm",
    roles: ["Software Developer", "Backend Developer", "Java Developer", "Software Engineer"],
    available: "Lins, SP · Brazil",
    featured: "Featured projects",
  },
  sections: {
    about: { eyebrow: "About", title: "Software engineering, grounded in real problems" },
    experience: { eyebrow: "Experience", title: "Where I've worked" },
    skills: {
      eyebrow: "Technologies",
      title: "Stack and tools",
      intro:
        "Each technology shows where it was used. Not everything here is professional experience — and the site makes that clear.",
    },
    projects: {
      eyebrow: "Projects",
      title: "What I'm building",
      intro: "Products in development, academic work and experiments beyond the web.",
    },
    education: { eyebrow: "Education", title: "Degree and training" },
    contact: {
      eyebrow: "Contact",
      title: "Let's talk",
      intro:
        "Open to software development opportunities, especially backend. Send a message or find me on the links below.",
    },
  },
  about: {
    facts: {
      education: "Education",
      focus: "Focus",
      location: "Location",
    },
  },
  experience: {
    kind: { development: "Development", support: "Support and infrastructure" },
    client: "Client",
  },
  skills: {
    usage: {
      professional: "Professional",
      projects: "Projects",
      studies: "Studies",
    },
    legend: "Legend",
  },
  projects: {
    filterLabel: "Filter projects",
    filters: {
      all: "All",
      backend: "Backend",
      fullstack: "Full Stack",
      ai: "AI",
      games: "Games",
      academic: "Academic",
    },
    status: {
      "in-progress": "In development",
      completed: "Completed",
      mvp: "Working MVP",
    },
    academic: "Academic project",
    featured: "Featured",
    others: "Other projects",
    empty: "No projects in this category yet.",
    detail: {
      problem: "Problem",
      solution: "Solution",
      architecture: "Architecture",
      features: "Key features",
      technologies: "Technologies",
      planned: "Planned",
      challenges: "Technical challenges",
      learnings: "Learnings",
      screenshots: "Screenshots",
      team: "Authors",
      links: "Links",
    },
  },
  education: {
    courses: "Courses & Training",
    instructor: "Instructor",
  },
  contact: {
    email: "Email",
    location: "Location",
    form: {
      name: "Name",
      email: "Your email",
      message: "Message",
      send: "Send message",
      hint: "Sending opens your email app with the message filled in.",
      subject: "Contact from portfolio",
    },
  },
  footer: {
    rights: "All rights reserved.",
  },
  notFound: {
    title: "Page not found",
    text: "The address you tried does not exist or has moved.",
    back: "Back to home",
  },
};

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
