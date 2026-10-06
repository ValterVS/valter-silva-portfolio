"use client";

import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState, type RefObject } from "react";
import { Reveal } from "@/components/Reveal";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import type { ImmersiveContent } from "./content";
import { Eyebrow } from "./Eyebrow";

type ContactProps = {
  sectionRef: RefObject<HTMLElement | null>;
  ui: ImmersiveDictionary;
  content: ImmersiveContent;
  resumeUrl: string | null;
};

export function ContactSection({ sectionRef, ui, content, resumeUrl }: ContactProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${content.email}`;
    }
  }

  const links = [
    { label: "LinkedIn", href: content.links.linkedin, external: true },
    { label: "GitHub", href: content.links.github, external: true },
    ...(resumeUrl ? [{ label: ui.resume, href: resumeUrl, external: false }] : []),
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-title"
      className="relative flex min-h-dvh flex-col justify-center px-5 py-28 sm:px-8 lg:px-14"
    >
      <div className="max-w-3xl max-lg:rounded-3xl max-lg:bg-ink/70 max-lg:p-6 max-lg:backdrop-blur-sm lg:max-w-[52vw]">
        <Reveal>
          <Eyebrow index="06">{ui.contact.eyebrow}</Eyebrow>
          <h2
            id="contact-title"
            className="mt-8 text-[clamp(3rem,8vw,8rem)] leading-[0.88] font-semibold tracking-[-0.045em] text-balance uppercase"
          >
            {ui.contact.title}
          </h2>
          <p className="mt-6 max-w-md text-muted">{ui.contact.text}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${content.email}`}
              className="text-[clamp(1.35rem,3.4vw,2.75rem)] font-medium tracking-tight break-all text-gold-soft underline decoration-gold/30 decoration-1 underline-offset-8 transition-colors hover:text-gold hover:decoration-gold"
            >
              {content.email}
            </a>
            <button
              type="button"
              onClick={copy}
              aria-live="polite"
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-muted uppercase transition-colors hover:text-fg"
            >
              {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
              {copied ? ui.contact.copied : ui.contact.copy}
            </button>
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
        </Reveal>
      </div>
    </section>
  );
}

const year = new Date().getFullYear();

export function FooterV2({
  ui,
  content,
  classicHref,
}: {
  ui: ImmersiveDictionary;
  content: ImmersiveContent;
  classicHref: string;
}) {
  return (
    <footer className="relative z-30 border-t border-fg/[0.08] px-5 py-8 sm:px-8 lg:px-14">
      <div className="flex flex-col gap-4 font-mono text-[10px] tracking-[0.28em] text-faint uppercase sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-fg">{content.name}</span> · {content.role} · {year}
        </p>
        <div className="flex gap-6">
          <Link href={classicHref} className="transition-colors hover:text-fg">
            {ui.footer.classic}
          </Link>
          <a href="#content" className="inline-flex items-center gap-1.5 transition-colors hover:text-fg">
            {ui.footer.top}
            <ArrowUp size={12} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
