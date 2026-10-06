"use client";

import { motion, type Variants } from "motion/react";
import { ArrowRight, ArrowUpRight, Download, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/ui";
import { profile } from "@/data/profile";
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

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero({ locale, dict, resumeUrl, featured }: HeroProps) {
  const home = localePath(locale);

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
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 min-w-0"
        >
          <motion.p variants={item} className="font-mono text-sm text-accent">
            <span className="text-faint">~/</span> {dict.hero.greeting}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-4 bg-linear-to-b from-white via-fg to-muted bg-clip-text text-[clamp(2.5rem,7.2vw,5.25rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-balance text-transparent uppercase"
          >
            {profile.name}
          </motion.h1>

          <motion.p variants={item} className="mt-5 flex items-baseline gap-3 text-xl font-medium text-fg sm:text-2xl">
            <span className="font-mono text-accent" aria-hidden="true">
              {"//"}
            </span>
            <RoleTicker roles={dict.hero.roles} />
          </motion.p>

          <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-lg">
            {profile.headline[locale]}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
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
          </motion.div>

          <motion.div variants={item} className="mt-3 flex flex-wrap gap-2">
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
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-faint"
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
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[340px] min-w-0 sm:h-[440px] lg:h-[min(640px,78svh)]"
        >
          <HeroVisual label={dict.a11y.sceneLabel} />
        </motion.div>
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
