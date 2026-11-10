import type { Localized } from "@/i18n/config";

export const siteUrl = "https://www.valtersilva.dev.br";

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
    pt: "Desenvolvedor de software com foco em backend: APIs e sistemas com Java, Spring Boot e bancos de dados.",
    en: "Software developer focused on backend: APIs and systems built with Java, Spring Boot and databases.",
  } satisfies Localized,

  statement: {
    pt: "Gosto de entender o problema a fundo e transformar requisitos em software simples e confiável.",
    en: "I like to understand problems in depth and turn requirements into simple, reliable software.",
  } satisfies Localized,

  focus: {
    pt: "Backend com Java e Spring Boot",
    en: "Backend with Java and Spring Boot",
  } satisfies Localized,

  about: {
    pt: [
      "Estou na fase final de Engenharia de Software na Unilins e me especializando em desenvolvimento backend: Java, Spring Boot, APIs REST, modelagem de dados com PostgreSQL e arquitetura de software.",
      "Me interesso por regras de negócio, integração entre sistemas e confiabilidade. A experiência com suporte L2 me deu um olhar prático sobre o que acontece depois do deploy: incidentes, causa raiz e estabilidade.",
    ],
    en: [
      "I'm in the final stage of a Software Engineering degree at Unilins, specializing in backend development: Java, Spring Boot, REST APIs, data modeling with PostgreSQL and software architecture.",
      "I'm drawn to business rules, system integration and reliability. Working in L2 support gave me a practical view of what happens after deployment: incidents, root causes and stability.",
    ],
  } satisfies Localized<string[]>,
};
