// A home do site é a versão editorial. A V1 continua em /v1, fora dos buscadores, até ser removida.
export const legacyPath = "/v1";

export const siteSections = ["home", "about", "experience", "skills", "projects", "education", "contact"] as const;
export type SiteSection = (typeof siteSections)[number];
