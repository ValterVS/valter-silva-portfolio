// A home do site é a versão imersiva (V2). A versão anterior continua em /v1, fora dos buscadores.
export const legacyPath = "/v1";

export const siteSections = ["home", "about", "experience", "skills", "projects", "education", "contact"] as const;
export type SiteSection = (typeof siteSections)[number];

// Âncoras da home principal correspondentes a cada seção da navegação da V1.
// Usadas nas páginas de projeto, que mantêm o header da V1 mas apontam para a home atual.
export const mainAnchors: Record<SiteSection, string> = {
  home: "hero",
  about: "about",
  experience: "experience",
  skills: "stack-list",
  projects: "work",
  education: "education",
  contact: "contact",
};
