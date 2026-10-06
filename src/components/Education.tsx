import { BookOpen, GraduationCap, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/ui";
import { courses, education } from "@/data/education";
import { chip } from "@/lib/styles";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Education({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section id="education" index="05" eyebrow={dict.sections.education.eyebrow} title={dict.sections.education.title}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="space-y-4">
          {education.map((item) => (
            <Reveal key={item.institution}>
              <article className="card relative overflow-hidden p-6 sm:p-7">
                <div
                  aria-hidden="true"
                  className="absolute -top-20 -right-20 size-52 rounded-full bg-accent/10 blur-3xl"
                />
                <span className="grid size-11 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <GraduationCap size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-fg">{item.course[locale]}</h3>
                <p className="mt-1 text-muted">{item.institution}</p>
                <p className="mt-4 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent-soft">
                  {item.status[locale]}
                </p>
                <p className="mt-4 flex items-center gap-1.5 font-mono text-xs text-faint">
                  <MapPin size={13} aria-hidden="true" />
                  {item.location[locale]}
                  {item.conclusion && <span>· {item.conclusion}</span>}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div>
          <h3 className="mb-4 font-mono text-xs tracking-[0.18em] text-faint uppercase">{dict.education.courses}</h3>
          <ul className="space-y-4">
            {courses.map((course, index) => (
              <li key={course.title}>
                <Reveal delay={index * 0.06}>
                  <article className="card flex gap-4 p-5 transition-colors hover:border-line-strong sm:p-6">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-accent">
                      <BookOpen size={16} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-fg">{course.title}</h4>
                      <p className="mt-1 text-sm text-muted">
                        {dict.education.instructor}: {course.instructor}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {course.topics.map((topic) => (
                          <li key={topic} className={chip}>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
