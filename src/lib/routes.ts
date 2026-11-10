// A home do site é a versão editorial. A V1 continua em /v1, fora dos buscadores, até ser removida.
export const legacyPath = "/v1";

export const siteSections = ["home", "about", "experience", "skills", "projects", "education", "contact"] as const;
export type SiteSection = (typeof siteSections)[number];

// Âncoras da home principal correspondentes a cada seção da navegação da V1.
// Usadas nas páginas de projeto, que mantêm o header da V1 mas apontam para a home atual.
// Formação e tecnologias ficam dentro de "Sobre" na home editorial.
export const mainAnchors: Record<SiteSection, string> = {
  home: "top",
  about: "about",
  experience: "experience",
  skills: "about",
  projects: "projects",
  education: "about",
  contact: "contact",
};
