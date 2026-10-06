import { Code2, Headset } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/ui";
import { experience } from "@/data/experience";
import { chip } from "@/lib/styles";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Experience({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section
      id="experience"
      index="02"
      eyebrow={dict.sections.experience.eyebrow}
      title={dict.sections.experience.title}
    >
      <ol className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-px before:bg-linear-to-b before:from-accent/50 before:via-line-strong before:to-transparent sm:before:left-[19px]">
        {experience.map((job, index) => {
          const Icon = job.kind === "development" ? Code2 : Headset;
          return (
            <li key={`${job.company}-${job.role}`} className="relative pl-12 sm:pl-16">
              <span className="absolute top-5 left-0 grid size-8 place-items-center rounded-full border border-accent/40 bg-bg text-accent sm:size-10">
                <Icon size={16} aria-hidden="true" />
              </span>
              <Reveal delay={index * 0.06}>
                <article className="card group p-5 transition-colors duration-300 hover:border-line-strong sm:p-7">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-mono text-xs text-accent">{job.period[locale]}</p>
                      <h3 className="mt-2 text-lg font-semibold text-fg sm:text-xl">{job.role}</h3>
                      <p className="mt-1 text-[15px] text-muted">
                        {job.company}
                        {job.client && (
                          <>
                            <span className="mx-2 text-faint" aria-hidden="true">
                              ·
                            </span>
                            {dict.experience.client}: {job.client}
                          </>
                        )}
                      </p>
                    </div>
                    <span className="inline-flex w-fit items-center rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-muted">
                      {dict.experience.kind[job.kind]}
                    </span>
                  </div>

                  <p className="mt-5 leading-relaxed text-pretty text-muted">{job.summary[locale]}</p>

                  <ul className="mt-4 space-y-2">
                    {job.highlights[locale].map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-[15px] leading-relaxed text-fg/85">
                        <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <li key={tag} className={chip}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
