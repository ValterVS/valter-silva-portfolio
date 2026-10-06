import type { ImmersiveContent } from "./content";

type Depth = "back" | "front";

export type FlowItem = { name: string; depth: Depth; side: "left" | "right"; offset: number; usage: string };

// Ordem e posição das tecnologias que sobem durante o scroll. Palavras "back" passam atrás do avatar.
export const flow: Omit<FlowItem, "usage">[] = [
  { name: "Java", depth: "back", side: "left", offset: 8 },
  { name: "Spring Boot", depth: "front", side: "right", offset: 6 },
  { name: "PostgreSQL", depth: "front", side: "left", offset: 6 },
  { name: "Docker", depth: "back", side: "right", offset: 14 },
  { name: "React", depth: "back", side: "left", offset: 28 },
  { name: "TypeScript", depth: "front", side: "right", offset: 10 },
  { name: "Node.js", depth: "front", side: "left", offset: 12 },
  { name: "Git", depth: "back", side: "right", offset: 30 },
  { name: "AWS", depth: "back", side: "left", offset: 38 },
  { name: "Python", depth: "front", side: "right", offset: 16 },
];

// Junta cada palavra com o rótulo de uso vindo de src/data/skills.ts.
export function buildFlow(content: ImmersiveContent): FlowItem[] {
  return flow.map((item) => {
    const skill = content.skills.flatMap((group) => group.skills).find((entry) => entry.name === item.name);
    const usage = (skill?.usage ?? []).map((key) => content.labels.usage[key]).join(" · ");
    return { ...item, usage };
  });
}
