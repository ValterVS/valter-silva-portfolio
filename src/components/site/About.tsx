import type { HomeDictionary } from "@/i18n/home";
import type { HomeContent } from "./content";

export function About({ content, ui }: { content: HomeContent; ui: HomeDictionary }) {
  return (
    <>
      <div className="max-w-measure space-y-5 text-pretty">
        {content.about.map((paragraph, index) => (
          <p key={index} className={index === 0 ? "text-lead" : undefined}>
            {paragraph}
          </p>
        ))}
      </div>

      <dl className="mt-block grid gap-x-10 gap-y-6 text-small sm:grid-cols-2">
        <div>
          <dt className="font-semibold">{ui.about.education}</dt>
          {content.education.map((item) => (
            <dd key={item.course} className="mt-1 text-foreground-muted">
              {item.course} — {item.institution}
              <br />
              {item.status} · {ui.about.location}
            </dd>
          ))}
        </div>
        <div>
          <dt className="font-semibold">{ui.about.courses}</dt>
          {content.courses.map((course) => (
            <dd key={course.title} className="mt-1 text-foreground-muted">
              {course.title} — {course.instructor}
            </dd>
          ))}
        </div>
      </dl>

      <h3 className="mt-block text-small font-semibold">{ui.about.skills}</h3>
      <dl className="mt-3 border-t border-border">
        {content.skills.map((skill) => (
          <div key={skill.group} className="grid gap-x-8 gap-y-1 border-b border-border py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <dt className="text-small text-foreground-muted">{skill.group}</dt>
            <dd>{skill.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
