// Configuração da cena 3D: camadas da arquitetura, de cima para baixo.
// angle posiciona cada camada ao redor do eixo central (a espiral passa por trás dele);
// tech é o rótulo exibido ao lado.
export const ringRadius = 1.5;

export const layers = [
  { id: "client", label: "client", tech: "React", y: 2.6, angle: -1.0 },
  { id: "api", label: "api", tech: "Spring Boot", y: 1.3, angle: -2.07 },
  { id: "services", label: "services", tech: "Java", y: 0, angle: -3.14 },
  { id: "database", label: "database", tech: "PostgreSQL", y: -1.3, angle: -4.21 },
  { id: "cloud", label: "cloud", tech: "Docker", y: -2.6, angle: -5.28 },
] as const;

export type Layer = (typeof layers)[number];
export type LayerId = Layer["id"];
