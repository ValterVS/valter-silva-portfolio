import type { ImmersiveDictionary } from "@/i18n/immersive";
import type { ImmersiveContent } from "./content";
import { Eyebrow } from "./Eyebrow";
import { FadeIn } from "./FadeIn";
import { flow } from "./flow";

// A primeira parte é o trecho de scroll em que as palavras sobem (camadas fixas em TechFlow.tsx).
// Com movimento reduzido, esse trecho encolhe e as tecnologias aparecem estáticas.
export function StackSection({ ui, content }: { ui: ImmersiveDictionary; content: ImmersiveContent }) {
  const [core, tools, additional] = content.stack;

  return (
    <>
      <section id="stack-flow" aria-labelledby="stack-title" className="relative h-[220svh] px-5 motion-reduce:h-auto sm:px-8 lg:px-14">
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
          <h3 className="font-mono text-[11px] tracking-[0.3em] text-gold uppercase">{ui.stack.tiers[core.tier]}</h3>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-fg/10 bg-fg/10 sm:grid-cols-2 lg:grid-cols-3">
            {core.skills.map((skill) => (
              <li key={skill.name} className="bg-ink px-6 py-7">
                <p className="text-[clamp(1.75rem,3vw,2.6rem)] leading-none font-semibold tracking-[-0.03em]">{skill.name}</p>
                <p className="mt-3 font-mono text-[10px] tracking-[0.22em] text-faint uppercase">
                  {skill.usage.map((usage) => content.labels.usage[usage]).join(" · ")}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="font-mono text-[11px] tracking-[0.3em] text-faint uppercase">{ui.stack.tiers[tools.tier]}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {tools.skills.map((skill) => (
                  <li key={skill.name} className="rounded-full border border-fg/15 px-3.5 py-1.5 text-sm text-fg/85">
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-[11px] tracking-[0.3em] text-faint uppercase">{ui.stack.tiers[additional.tier]}</h3>
              <p className="mt-5 text-sm leading-loose text-muted">
                {additional.skills.map((skill) => skill.name).join(" · ")}
              </p>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
