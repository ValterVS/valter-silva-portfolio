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

  // Apresentação da home (abaixo do "Olá, eu sou o Valter."). Também usada na descrição do JSON-LD.
  headline: {
    pt: "Trabalho principalmente no backend, com Java e Spring Boot: APIs, modelagem de dados e regras de negócio. Quando o projeto pede, também construo a interface com React e Next.js. No Jurimetria IA, meu TCC, usamos um modelo de IA para resumir decisões judiciais em uma saída estruturada, que o backend valida antes de salvar.",
    en: "I work mostly on the backend with Java and Spring Boot — APIs, data modeling and business rules. When a project calls for it, I build the front end too, with React and Next.js. In Jurimetria IA, my capstone project, we used an AI model to turn court rulings into structured summaries that the backend validates before saving them.",
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
      "Estou na reta final de Engenharia de Software na Unilins. O que mais me prende na área é investigar: entender por que um sistema se comporta de determinado jeito, seguir o código e os logs até encontrar a causa e só então mudar alguma coisa.",
      "No suporte L2 da Solutis, isso era rotina: incidentes, causa raiz, estabilidade. No desenvolvimento, é o que me faz gostar de backend: regras de negócio, modelagem de dados e APIs que precisam continuar funcionando depois do deploy.",
    ],
    en: [
      "I'm in the final stretch of a Software Engineering degree at Unilins. What keeps me hooked is investigating: figuring out why a system behaves the way it does, following the code and the logs until the cause turns up, and only then changing something.",
      "In L2 support at Solutis that was the daily routine — incidents, root causes, stability. In development, it's what draws me to backend work: business rules, data modeling and APIs that have to keep working after the deploy.",
    ],
  } satisfies Localized<string[]>,
};
