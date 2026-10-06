import { Reveal } from "@/components/Reveal";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import type { ImmersiveContent } from "./content";
import { Eyebrow } from "./Eyebrow";

export function EducationSection({ ui, content }: { ui: ImmersiveDictionary; content: ImmersiveContent }) {
  return (
    <section id="education" aria-labelledby="education-title" className="relative px-5 py-28 sm:px-8 lg:px-14">
      <Reveal>
        <Eyebrow index="05" id="education-title">
          {ui.education.eyebrow}
        </Eyebrow>
      </Reveal>

      <div className="mt-14 grid gap-16 lg:grid-cols-2 lg:gap-24">
        {content.education.map((item) => (
          <Reveal key={item.institution}>
            <h3 className="text-[clamp(2rem,4.5vw,4rem)] leading-[0.95] font-semibold tracking-[-0.03em] uppercase">
              {item.course}
            </h3>
            <p className="mt-5 text-lg text-fg/80">{item.institution}</p>
            <p className="mt-3 font-mono text-[11px] tracking-[0.25em] text-gold uppercase">{item.status}</p>
            <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-faint uppercase">
              {item.location}
              {item.conclusion && ` · ${item.conclusion}`}
            </p>
          </Reveal>
        ))}

        <Reveal delay={0.1}>
          <h3 className="font-mono text-[11px] tracking-[0.3em] text-faint uppercase">{ui.education.courses}</h3>
          <ul className="mt-6 border-t border-fg/10">
            {content.courses.map((course) => (
              <li key={course.title} className="border-b border-fg/10 py-6">
                <p className="text-xl font-medium tracking-tight">{course.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {content.labels.instructor}: {course.instructor}
                </p>
                <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-[0.18em] text-faint uppercase">
                  {course.topics.join(" / ")}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
