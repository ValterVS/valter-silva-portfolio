"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { RefObject } from "react";
import { Reveal } from "@/components/Reveal";
import type { Usage } from "@/data/skills";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import { cx } from "@/lib/styles";
import type { ImmersiveContent } from "./content";
import { Eyebrow } from "./Eyebrow";

type Depth = "back" | "front";

// Ordem e posição das tecnologias que sobem durante o scroll. Palavras "back" passam atrás do avatar.
const flow: { name: string; depth: Depth; side: "left" | "right"; offset: number }[] = [
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

const WINDOW = 0.34;
const STEP = 0.065;

function usageOf(content: ImmersiveContent, name: string): Usage[] {
  for (const group of content.skills) {
    const skill = group.skills.find((item) => item.name === name);
    if (skill) return skill.usage;
  }
  return [];
}

function RisingWord({
  item,
  index,
  progress,
  usage,
}: {
  item: (typeof flow)[number];
  index: number;
  progress: MotionValue<number>;
  usage: string;
}) {
  const start = 0.04 + index * STEP;
  const y = useTransform(progress, [start, start + WINDOW], ["70vh", "-70vh"]);
  const opacity = useTransform(progress, [start, start + 0.07, start + WINDOW - 0.1, start + WINDOW - 0.04], [0, 1, 1, 0]);
  const front = item.depth === "front";
  const position = item.side === "left" ? { left: `${item.offset}%` } : { right: `${item.offset}%` };

  return (
    <motion.div
      style={{ y, opacity, ...position }}
      className={cx("absolute top-1/2 -translate-y-1/2", item.side === "right" && "text-right")}
    >
      <p
        className={cx(
          "leading-none font-semibold tracking-[-0.04em] whitespace-nowrap uppercase",
          front
            ? cx("text-[clamp(2.4rem,6.4vw,6.75rem)]", index % 4 === 1 ? "text-outline text-gold" : "text-fg/90")
            : "text-[clamp(3.5rem,11vw,11rem)] text-fg/[0.07]",
        )}
      >
        {item.name}
      </p>
      {front && usage && (
        <p className="mt-3 font-mono text-[10px] tracking-[0.3em] text-gold/80 uppercase">{usage}</p>
      )}
    </motion.div>
  );
}

export function TechLayer({
  depth,
  progress,
  content,
}: {
  depth: Depth;
  progress: MotionValue<number>;
  content: ImmersiveContent;
}) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "pointer-events-none fixed inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_85%,transparent)]",
        depth === "back" ? "z-[5]" : "z-20",
      )}
    >
      {flow.map((item, index) =>
        item.depth === depth ? (
          <RisingWord
            key={item.name}
            item={item}
            index={index}
            progress={progress}
            usage={usageOf(content, item.name)
              .map((usage) => content.labels.usage[usage])
              .join(" · ")}
          />
        ) : null,
      )}
    </div>
  );
}

type StackProps = {
  sectionRef: RefObject<HTMLElement | null>;
  listRef: RefObject<HTMLElement | null>;
  ui: ImmersiveDictionary;
  content: ImmersiveContent;
  flow: boolean;
};

const markers: Record<Usage, string> = {
  professional: "bg-gold",
  projects: "border border-gold/70",
  studies: "bg-faint",
};

export function StackSection({ sectionRef, listRef, ui, content, flow: animated }: StackProps) {
  const usages: Usage[] = ["professional", "projects", "studies"];

  return (
    <>
      <section
        ref={sectionRef}
        aria-labelledby="stack-title"
        className={cx("relative px-5 sm:px-8 lg:px-14", animated && "h-[260dvh]")}
      >
        <div className="max-w-md pt-28">
          <Eyebrow index="02">{ui.stack.eyebrow}</Eyebrow>
          <h2 id="stack-title" className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            {ui.stack.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{ui.stack.intro}</p>
        </div>
        {!animated && (
          <p aria-hidden="true" className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-4xl font-semibold uppercase text-fg/80">
            {flow.map((item) => (
              <span key={item.name}>{item.name}</span>
            ))}
          </p>
        )}
      </section>

      <section ref={listRef} aria-labelledby="stack-title" className="relative px-5 pt-16 pb-28 sm:px-8 lg:px-14">
        <Reveal>
          <ul className="mb-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.25em] text-muted uppercase">
            {usages.map((usage) => (
              <li key={usage} className="flex items-center gap-2">
                <span className={cx("size-2 rounded-full", markers[usage])} aria-hidden="true" />
                {content.labels.usage[usage]}
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {content.skills.map((group, index) => (
            <Reveal key={group.title} delay={(index % 4) * 0.05}>
              <h3 className="border-b border-fg/10 pb-3 font-mono text-[11px] tracking-[0.28em] text-gold uppercase">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="flex items-center justify-between gap-3 text-[15px] text-fg/90">
                    <span className={cx(skill.usage.includes("professional") && "text-fg")}>{skill.name}</span>
                    <span className="flex shrink-0 gap-1.5" aria-hidden="true">
                      {usages
                        .filter((usage) => skill.usage.includes(usage))
                        .map((usage) => (
                          <span key={usage} className={cx("size-1.5 rounded-full", markers[usage])} />
                        ))}
                    </span>
                    <span className="sr-only">
                      ({skill.usage.map((usage) => content.labels.usage[usage]).join(", ")})
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
