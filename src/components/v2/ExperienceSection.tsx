import { Reveal } from "@/components/Reveal";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import type { ImmersiveContent } from "./content";
import { Eyebrow } from "./Eyebrow";

export function ExperienceSection({ ui, content }: { ui: ImmersiveDictionary; content: ImmersiveContent }) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative px-5 py-28 sm:px-8 lg:px-14"
    >
      <Reveal>
        <Eyebrow index="03" id="experience-title">
          {ui.experience.eyebrow}
        </Eyebrow>
      </Reveal>

      <ol className="relative mt-16 before:absolute before:top-4 before:bottom-4 before:left-0 before:w-px before:bg-linear-to-b before:from-gold/60 before:via-fg/15 before:to-transparent lg:before:left-[calc(22vw+1.25rem)]">
        {content.experience.map((job) => (
          <li key={`${job.company}-${job.startYear}`} className="relative">
            <Reveal>
              <article
                tabIndex={0}
                className="group grid gap-x-10 border-b border-fg/[0.07] py-10 pl-6 outline-none focus-visible:bg-fg/[0.02] lg:grid-cols-[22vw_minmax(0,1fr)] lg:pl-0"
              >
                <p
                  aria-hidden="true"
                  className="text-outline text-[clamp(3.5rem,9vw,8.5rem)] leading-none font-semibold tracking-[-0.04em] text-fg/25 transition-colors duration-500 group-hover:text-gold lg:text-right"
                >
                  {job.startYear}
                </p>
                <div className="relative mt-4 lg:mt-2 lg:pl-10">
                  <span
                    aria-hidden="true"
                    className="absolute top-3 -left-[1.8rem] size-2.5 rounded-full border border-gold bg-ink transition-colors group-hover:bg-gold lg:-left-[1.55rem]"
                  />
                  <p className="font-mono text-[11px] tracking-[0.25em] text-gold uppercase">
                    {job.period} · {job.kind}
                  </p>
                  <h3 className="mt-3 text-[clamp(1.6rem,3.2vw,2.75rem)] leading-tight font-semibold tracking-tight uppercase">
                    {job.company}
                  </h3>
                  <p className="mt-1 text-lg text-fg/80">
                    {job.role}
                    {job.client && <span className="text-muted"> · {job.client}</span>}
                  </p>
                  <p className="mt-4 max-w-2xl leading-relaxed text-pretty text-muted">{job.summary}</p>

                  <div className="hover-reveal grid">
                    <div className="min-h-0 overflow-hidden">
                      <ul className="mt-5 max-w-2xl space-y-2">
                        {job.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-3 text-[15px] leading-relaxed text-fg/80">
                            <span className="mt-2.5 h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 font-mono text-[11px] leading-relaxed tracking-[0.15em] text-faint uppercase">
                        {job.tags.join(" / ")}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
