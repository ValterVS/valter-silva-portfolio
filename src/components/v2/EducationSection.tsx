import { FadeIn } from "./FadeIn";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import type { ImmersiveContent } from "./content";
import { Eyebrow } from "./Eyebrow";

export function EducationSection({ ui, content }: { ui: ImmersiveDictionary; content: ImmersiveContent }) {
  return (
    <section id="education" aria-labelledby="education-title" className="relative px-5 py-24 sm:px-8 lg:px-14">
      <FadeIn>
        <Eyebrow index="05" id="education-title">
          {ui.education.eyebrow}
        </Eyebrow>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-24">
          {content.education.map((item) => (
            <div key={item.institution}>
              <h3 className="text-[clamp(2rem,4.5vw,4rem)] leading-[0.95] font-semibold tracking-[-0.03em] uppercase">
                {item.course}
              </h3>
              <p className="mt-5 text-lg text-fg/80">{item.institution}</p>
              <p className="mt-3 font-mono text-[11px] tracking-[0.25em] text-gold uppercase">
                {item.status}
                {item.conclusion && ` · ${item.conclusion}`}
              </p>
            </div>
          ))}

          <div>
            <h3 className="font-mono text-[11px] tracking-[0.3em] text-faint uppercase">{ui.education.courses}</h3>
            <ul className="mt-5 space-y-3">
              {content.courses.map((course) => (
                <li key={course.title} className="text-[15px] text-fg/80">
                  {course.title}
                  <span className="text-muted"> · {course.instructor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
