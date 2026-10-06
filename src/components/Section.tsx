import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { cx } from "@/lib/styles";

type SectionProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, index, eyebrow, title, intro, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cx("relative py-16 sm:py-20", className)}>
      <div className="container-page">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-3 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-accent uppercase">
            <span className="text-faint">{index}</span>
            <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className="text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-4 text-base leading-relaxed text-pretty text-muted">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
