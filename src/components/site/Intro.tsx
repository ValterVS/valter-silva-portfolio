import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { HomeDictionary } from "@/i18n/home";
import { action } from "./ui";

export function Intro({ ui, headline, github }: { ui: HomeDictionary; headline: string; github: string }) {
  return (
    <section aria-labelledby="intro-title" className="pt-16 pb-section sm:pt-24">
      <h1 id="intro-title" className="font-display text-display font-medium text-balance">
        {ui.intro.title}
      </h1>
      <p className="mt-3 font-display text-title text-primary">{ui.intro.role}</p>
      <p className="mt-8 max-w-measure text-lead text-pretty text-foreground-muted">{headline}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a href="#projects" className={action.primary}>
          {ui.intro.projects}
          <ArrowDown size={16} aria-hidden="true" />
        </a>
        <a href={github} target="_blank" rel="noreferrer" className={action.secondary}>
          {ui.intro.github}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
