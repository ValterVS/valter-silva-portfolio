import { FadeIn } from "./FadeIn";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import type { ImmersiveContent } from "./content";
import { Eyebrow } from "./Eyebrow";

export function AboutSection({ ui, content }: { ui: ImmersiveDictionary; content: ImmersiveContent }) {
  const degree = content.education[0];
  const facts = [
    { label: ui.about.education, value: degree?.course, detail: degree?.status },
    { label: ui.about.focus, value: content.focus },
    { label: ui.about.location, value: content.location },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="relative flex min-h-svh items-center px-5 py-28 sm:px-8 lg:px-14">
      <div className="max-w-2xl max-lg:rounded-3xl max-lg:bg-ink/70 max-lg:p-6 max-lg:backdrop-blur-sm lg:max-w-[46vw]">
        <FadeIn>
          <Eyebrow index="01">{ui.about.eyebrow}</Eyebrow>
          <h2 id="about-title" className="mt-8 text-[clamp(2rem,4.4vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
            {content.statement}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1} className="mt-10 space-y-4 text-base leading-relaxed text-pretty text-muted sm:text-[17px]">
          {content.about.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </FadeIn>
        <FadeIn delay={0.15}>
          <dl className="mt-12 grid gap-6 border-t border-fg/10 pt-8 sm:grid-cols-3">
            {facts.map((fact) =>
              fact.value ? (
                <div key={fact.label}>
                  <dt className="font-mono text-[10px] tracking-[0.3em] text-faint uppercase">{fact.label}</dt>
                  <dd className="mt-2 text-[15px] text-fg">{fact.value}</dd>
                  {fact.detail && <dd className="mt-1 text-xs text-muted">{fact.detail}</dd>}
                </div>
              ) : null,
            )}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
