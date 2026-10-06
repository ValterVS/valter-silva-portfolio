import { Crosshair, GraduationCap, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/ui";
import { education } from "@/data/education";
import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function About({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const degree = education[0];
  const facts = [
    {
      icon: GraduationCap,
      label: dict.about.facts.education,
      value: degree ? `${degree.course[locale]} — ${degree.shortName}` : null,
      detail: degree?.status[locale],
    },
    { icon: Crosshair, label: dict.about.facts.focus, value: profile.focus[locale] },
    { icon: MapPin, label: dict.about.facts.location, value: profile.location[locale] },
  ];

  return (
    <Section id="about" index="01" eyebrow={dict.sections.about.eyebrow} title={dict.sections.about.title}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal className="space-y-5 text-base leading-relaxed text-pretty text-muted sm:text-lg">
          {profile.about[locale].map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="card divide-y divide-line">
            {facts.map(({ icon: Icon, label, value, detail }) =>
              value ? (
                <div key={label} className="flex gap-4 p-5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-accent">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <dt className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">{label}</dt>
                    <dd className="mt-1 text-[15px] text-fg">{value}</dd>
                    {detail && <dd className="mt-0.5 text-sm text-muted">{detail}</dd>}
                  </div>
                </div>
              ) : null,
            )}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
