import type { Localized } from "@/i18n/config";

export const siteUrl = "https://valtersilva.dev.br";

// Dados pessoais e links exibidos no site. Substitua aqui se algo mudar.
export const profile = {
  name: "Valter da Silva",
  brand: "Valter Silva",
  initials: "VS",
  role: "Software Developer",
  email: "contato@valtersilva.dev.br",
  // Telefone opcional. Preencha (ex.: "+55 14 99999-9999") e ative showPhone para exibir no contato.
  phone: null as string | null,
  showPhone: false,
  location: {
    pt: "Lins, São Paulo, Brasil",
    en: "Lins, São Paulo, Brazil",
  } satisfies Localized,
  links: {
    github: "https://github.com/ValterVS",
    repositories: "https://github.com/ValterVS?tab=repositories",
    linkedin: "https://www.linkedin.com/in/valter-silva-eng/",
  },
  // Coloque os PDFs em public/resume com estes nomes. Se um faltar, o site usa o outro.
  resume: {
    pt: "/resume/curriculo-valter-silva-pt.pdf",
    en: "/resume/resume-valter-silva-en.pdf",
  } satisfies Localized,

  headline: {
    pt: "Desenvolvedor de software focado na construção de aplicações modernas, APIs e sistemas backend — soluções que conectam tecnologia a problemas reais.",
    en: "Software developer focused on building modern applications, APIs and backend systems — solutions that connect technology to real problems.",
  } satisfies Localized,

  focus: {
    pt: "Backend com Java e Spring Boot",
    en: "Backend with Java and Spring Boot",
  } satisfies Localized,

  about: {
    pt: [
      "Sou estudante de Engenharia de Software na Unilins e estou no último período da graduação. Minha trajetória passa tanto pelo desenvolvimento quanto pelo suporte técnico: já construí aplicações web e integrações entre sistemas, trabalhei com banco de dados e atuei com suporte L2 e infraestrutura.",
      "Meu foco principal é o desenvolvimento backend — Java, Spring Boot, APIs, banco de dados e arquitetura de software — sempre pensando no produto que está sendo construído, não só no código.",
      "Também trabalho e estudo frontend, automação e inteligência artificial. Ter passado pelo suporte me deu um olhar prático sobre o que acontece com o software depois do deploy: incidentes, causa raiz e estabilidade.",
    ],
    en: [
      "I'm a Software Engineering student at Unilins, in the final term of my degree. My path covers both development and technical support: I've built web applications and system integrations, worked with databases, and handled L2 support and infrastructure.",
      "My main focus is backend development — Java, Spring Boot, APIs, databases and software architecture — always thinking about the product being built, not just the code.",
      "I also work with and study frontend, automation and artificial intelligence. Coming from support gave me a practical view of what happens to software after deployment: incidents, root causes and stability.",
    ],
  } satisfies Localized<string[]>,
};
