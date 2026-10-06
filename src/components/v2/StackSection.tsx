import type { Usage } from "@/data/skills";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import { cx } from "@/lib/styles";
import type { ImmersiveContent } from "./content";
import { Eyebrow } from "./Eyebrow";
import { FadeIn } from "./FadeIn";
import { flow } from "./flow";

const usages: Usage[] = ["professional", "projects", "studies"];

const markers: Record<Usage, string> = {
  professional: "bg-gold",
  projects: "border border-gold/70",
  studies: "bg-faint",
};

// A primeira parte é o trecho de scroll em que as palavras sobem (camadas fixas em TechFlow.tsx).
// Com movimento reduzido, esse trecho encolhe e as tecnologias aparecem estáticas.
export function StackSection({ ui, content }: { ui: ImmersiveDictionary; content: ImmersiveContent }) {
  return (
    <>
      <section id="stack-flow" aria-labelledby="stack-title" className="relative h-[260svh] px-5 motion-reduce:h-auto sm:px-8 lg:px-14">
        <div className="max-w-md pt-28">
          <Eyebrow index="02">{ui.stack.eyebrow}</Eyebrow>
          <h2 id="stack-title" className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            {ui.stack.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{ui.stack.intro}</p>
        </div>
        <p
          aria-hidden="true"
          className="mt-12 hidden flex-wrap gap-x-6 gap-y-2 text-4xl font-semibold text-fg/80 uppercase motion-reduce:flex"
        >
          {flow.map((item) => (
            <span key={item.name}>{item.name}</span>
          ))}
        </p>
      </section>

      <section id="stack-list" aria-labelledby="stack-title" className="relative px-5 pt-16 pb-28 sm:px-8 lg:px-14">
        <FadeIn>
          <ul className="mb-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.25em] text-muted uppercase">
            {usages.map((usage) => (
              <li key={usage} className="flex items-center gap-2">
                <span className={cx("size-2 rounded-full", markers[usage])} aria-hidden="true" />
                {content.labels.usage[usage]}
              </li>
            ))}
          </ul>
        </FadeIn>
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {content.skills.map((group, index) => (
            <FadeIn key={group.title} delay={(index % 4) * 0.04}>
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
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
