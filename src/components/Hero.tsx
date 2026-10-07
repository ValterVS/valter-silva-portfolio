import { ArrowRight, ArrowUpRight, Download, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/ui";
import { profile } from "@/data/profile";
import { legacyPath } from "@/lib/routes";
import { button } from "@/lib/styles";
import { GithubIcon, LinkedinIcon } from "./icons";
import { RoleTicker } from "./RoleTicker";
import { HeroVisual } from "./scene/HeroVisual";

type HeroProps = {
  locale: Locale;
  dict: Pick<Dictionary, "hero" | "actions" | "a11y">;
  resumeUrl: string | null;
  featured: { slug: string; title: string; href: string }[];
};

const stack = ["Java", "Spring Boot", "PostgreSQL", "React"];

// Entrada em CSS: o texto já vem visível no HTML, sem esperar o JavaScript.
const enter = "animate-[fade-up_0.55s_cubic-bezier(0.22,1,0.36,1)_both]";
const delay = (index: number) => ({ animationDelay: `${index * 80}ms` });

export function Hero({ locale, dict, resumeUrl, featured }: HeroProps) {
  const home = localePath(locale, legacyPath);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pt-28 pb-14 sm:pt-32 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:pt-20 lg:pb-10"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_65%_40%,black,transparent)]" />
        <div className="absolute -top-48 right-[-12%] size-[38rem] rounded-full bg-accent/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-14%] size-[30rem] rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      <div className="container-page grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-4">
        <div className="relative z-10 min-w-0">
          <p className={`${enter} font-mono text-sm text-accent`} style={delay(0)}>
            <span className="text-faint">~/</span> {dict.hero.greeting}
          </p>

          <h1
            className={`${enter} mt-4 bg-linear-to-b from-white via-fg to-muted bg-clip-text text-[clamp(2.5rem,7.2vw,5.25rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-balance text-transparent uppercase`}
            style={delay(1)}
          >
            {profile.name}
          </h1>

          <p className={`${enter} mt-5 flex items-baseline gap-3 text-xl font-medium text-fg sm:text-2xl`} style={delay(2)}>
            <span className="font-mono text-accent" aria-hidden="true">
              {"//"}
            </span>
            <RoleTicker roles={dict.hero.roles} />
          </p>

          <p className={`${enter} mt-6 max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-lg`} style={delay(3)}>
            {profile.headline[locale]}
          </p>

          <div className={`${enter} mt-8 flex flex-wrap gap-3`} style={delay(4)}>
            <Link href={`${home}#projects`} className={button.primary}>
              {dict.actions.viewProjects}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            {resumeUrl && (
              <a href={resumeUrl} download className={button.secondary}>
                <Download size={16} aria-hidden="true" />
                {dict.actions.downloadResume}
              </a>
            )}
          </div>

          <div className={`${enter} mt-3 flex flex-wrap gap-2`} style={delay(5)}>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className={button.small}>
              <GithubIcon size={15} />
              GitHub
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className={button.small}>
              <LinkedinIcon size={14} />
              LinkedIn
            </a>
            <Link href={`${home}#contact`} className={button.small}>
              <Mail size={15} aria-hidden="true" />
              {dict.actions.contact}
            </Link>
          </div>

          <div
            className={`${enter} mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-faint`}
            style={delay(6)}
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} aria-hidden="true" />
              {dict.hero.available}
            </span>
            <span className="inline-flex flex-wrap items-center gap-x-2">
              {stack.map((name, index) => (
                <span key={name} className="inline-flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">·</span>}
                  <span className="text-muted">{name}</span>
                </span>
              ))}
            </span>
          </div>
        </div>

        <div className="relative h-[340px] min-w-0 animate-[fade-in_1s_ease_0.2s_both] sm:h-[440px] lg:h-[min(640px,78svh)]">
          <HeroVisual label={dict.a11y.sceneLabel} />
        </div>
      </div>

      {featured.length > 0 && (
        <div className="container-page mt-10 lg:mt-6">
          <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:gap-6">
            <p className="font-mono text-[11px] tracking-[0.2em] text-faint uppercase">{dict.hero.featured}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {featured.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={project.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
                  >
                    {project.title}
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
