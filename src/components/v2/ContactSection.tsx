import { ArrowUpRight } from "lucide-react";
import { CopyEmail } from "./CopyEmail";
import { FadeIn } from "./FadeIn";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import type { ImmersiveContent } from "./content";
import { Eyebrow } from "./Eyebrow";

type ContactProps = {
  ui: ImmersiveDictionary;
  email: string;
  links: ImmersiveContent["links"];
  resumeUrl: string | null;
};

export function ContactSection({ ui, email, links: profileLinks, resumeUrl }: ContactProps) {
  const links = [
    { label: "LinkedIn", href: profileLinks.linkedin, external: true },
    { label: "GitHub", href: profileLinks.github, external: true },
    ...(resumeUrl ? [{ label: ui.resume, href: resumeUrl, external: false }] : []),
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative flex min-h-svh flex-col justify-center px-5 py-28 sm:px-8 lg:px-14"
    >
      <div className="max-w-3xl max-lg:rounded-3xl max-lg:bg-ink/70 max-lg:p-6 max-lg:backdrop-blur-sm lg:max-w-[52vw]">
        <FadeIn>
          <Eyebrow index="06">{ui.contact.eyebrow}</Eyebrow>
          <h2
            id="contact-title"
            className="mt-8 text-[clamp(3rem,8vw,8rem)] leading-[0.88] font-semibold tracking-[-0.045em] text-balance uppercase"
          >
            {ui.contact.title}
          </h2>
          <p className="mt-6 max-w-md text-muted">{ui.contact.text}</p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-12">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${email}`}
              className="text-[clamp(1.35rem,3.4vw,2.75rem)] font-medium tracking-tight break-all text-gold-soft underline decoration-gold/30 decoration-1 underline-offset-8 transition-colors hover:text-gold hover:decoration-gold"
            >
              {email}
            </a>
            <CopyEmail email={email} label={ui.contact.copy} done={ui.contact.copied} />
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noreferrer" } : { download: true })}
                  className="inline-flex items-center gap-2 text-sm font-medium tracking-[0.25em] text-fg uppercase transition-colors hover:text-gold"
                >
                  {link.label}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
