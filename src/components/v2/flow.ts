import type { ImmersiveContent } from "./content";

type Depth = "back" | "front";

export type FlowItem = { name: string; depth: Depth; side: "left" | "right"; offset: number; usage: string };

// Ordem e posição das tecnologias que sobem durante o scroll. As da frente (com rótulo de uso) são o núcleo
// backend; as de trás passam como sombra atrás do conteúdo.
export const flow: Omit<FlowItem, "usage">[] = [
  { name: "Java", depth: "front", side: "left", offset: 8 },
  { name: "Spring Boot", depth: "front", side: "right", offset: 6 },
  { name: "SQL", depth: "back", side: "right", offset: 26 },
  { name: "REST APIs", depth: "front", side: "left", offset: 10 },
  { name: "Git", depth: "back", side: "left", offset: 30 },
  { name: "PostgreSQL", depth: "front", side: "right", offset: 8 },
  { name: "Docker", depth: "back", side: "left", offset: 14 },
];

// Junta cada palavra com o rótulo de uso vindo de src/data/skills.ts.
export function buildFlow(content: ImmersiveContent): FlowItem[] {
  return flow.map((item) => {
    const skill = content.skills.flatMap((group) => group.skills).find((entry) => entry.name === item.name);
    const usage = (skill?.usage ?? []).map((key) => content.labels.usage[key]).join(" · ");
    return { ...item, usage };
  });
}
