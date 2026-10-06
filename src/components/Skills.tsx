"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/ui";
import { skillGroups, type Usage } from "@/data/skills";
import { cx } from "@/lib/styles";

const usages: Usage[] = ["professional", "projects", "studies"];

const marker: Record<Usage, string> = {
  professional: "bg-accent",
  projects: "border border-accent-soft",
  studies: "bg-faint",
};

type SkillsProps = {
  locale: Locale;
  labels: Dictionary["skills"];
};

export function SkillsGrid({ locale, labels }: SkillsProps) {
  const [focus, setFocus] = useState<Usage | null>(null);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label={labels.legend}>
        {usages.map((usage) => {
          const active = focus === usage;
          return (
            <button
              key={usage}
              type="button"
              aria-pressed={active}
              onClick={() => setFocus(active ? null : usage)}
              className={cx(
                "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors",
                active
                  ? "border-accent/50 bg-accent/10 text-fg"
                  : "border-line bg-surface-2/60 text-muted hover:border-line-strong hover:text-fg",
              )}
            >
              <span className={cx("size-2 rounded-full", marker[usage])} aria-hidden="true" />
              {labels.usage[usage]}
            </button>
          );
        })}
      </div>

      <div className="grid-fill grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <motion.div
            key={group.title.en}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.45, delay: (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="card p-5"
          >
            <h3 className="font-mono text-xs tracking-[0.16em] text-accent uppercase">{group.title[locale]}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.skills.map((skill) => {
                const dimmed = focus !== null && !skill.usage.includes(focus);
                const professional = skill.usage.includes("professional");
                return (
                  <li
                    key={skill.name}
                    className={cx(
                      "inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition-[opacity,border-color,transform] duration-200 hover:-translate-y-0.5",
                      professional
                        ? "border-accent/30 bg-accent/[0.07] text-fg hover:border-accent/50"
                        : "border-line bg-surface-2/70 text-fg/85 hover:border-line-strong",
                      dimmed && "opacity-25",
                    )}
                  >
                    {skill.name}
                    <span className="flex gap-1" aria-hidden="true">
                      {usages
                        .filter((usage) => skill.usage.includes(usage))
                        .map((usage) => (
                          <span key={usage} className={cx("size-1.5 rounded-full", marker[usage])} />
                        ))}
                    </span>
                    <span className="sr-only">
                      ({skill.usage.map((usage) => labels.usage[usage]).join(", ")})
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </div>
    </>
  );
}
