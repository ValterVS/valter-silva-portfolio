import { FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import type { ImmersiveContent } from "./content";

type CornersProps = {
  ui: ImmersiveDictionary;
  resumeUrl: string | null;
  links: ImmersiveContent["links"];
};

export function Corners({ ui, resumeUrl, links }: CornersProps) {
  const socials = [
    { label: "GitHub", href: links.github, icon: GithubIcon },
    { label: "LinkedIn", href: links.linkedin, icon: LinkedinIcon },
  ];

  return (
    <>
      <ul className="fixed bottom-8 left-8 z-40 hidden flex-col items-center gap-5 after:mt-1 after:h-14 after:w-px after:bg-fg/20 lg:flex">
        {socials.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="group relative flex text-fg/55 transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-gold"
            >
              <Icon size={17} />
              <span className="pointer-events-none absolute top-1/2 left-8 -translate-y-1/2 font-mono text-[10px] tracking-[0.25em] whitespace-nowrap text-gold uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {label}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {resumeUrl && (
        <a
          href={resumeUrl}
          download
          className="group fixed right-8 bottom-8 z-40 hidden items-center gap-2.5 font-mono text-[11px] tracking-[0.3em] text-fg/70 uppercase transition-colors hover:text-gold lg:flex"
        >
          <FileText size={14} aria-hidden="true" />
          {ui.resume}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </a>
      )}
    </>
  );
}
