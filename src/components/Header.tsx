"use client";

import { AnimatePresence, motion } from "motion/react";
import { FileText, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/ui";
import { profile } from "@/data/profile";
import { siteSections as sections, type SiteSection } from "@/lib/routes";
import { button, cx } from "@/lib/styles";
import { GithubIcon, LinkedinIcon } from "./icons";
import { LanguageSwitch } from "./LanguageSwitch";

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

type HeaderProps = {
  locale: Locale;
  dict: Pick<Dictionary, "nav" | "actions" | "a11y">;
  resumeUrl: string | null;
  // Página onde ficam as seções e, se os ids forem outros, a âncora de cada uma.
  home: string;
  anchors?: Record<SiteSection, string>;
};

export function Header({ locale, dict, resumeUrl, home, anchors }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const scrolled = useSyncExternalStore(subscribeToScroll, () => window.scrollY > 12, () => false);
  const sectionHref = (id: SiteSection) => `${home}#${anchors?.[id] ?? id}`;

  useEffect(() => {
    const elements = sections
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        solid ? "border-line bg-bg/75 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={home} className="group flex items-center gap-2.5 rounded-md" onClick={() => setOpen(false)}>
          <span className="grid size-8 place-items-center rounded-lg border border-accent/40 bg-accent/10 font-mono text-xs font-semibold text-accent transition-colors group-hover:bg-accent/20">
            {profile.initials}
          </span>
          <span className="text-sm font-semibold tracking-tight text-fg">{profile.brand}</span>
        </Link>

        <nav aria-label={dict.a11y.mainNav} className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {sections.map((id) => (
              <li key={id}>
                <Link
                  href={sectionHref(id)}
                  aria-current={active === id ? "location" : undefined}
                  className={cx(
                    "relative rounded-full px-3 py-2 text-[13px] transition-colors",
                    active === id ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {dict.nav[id]}
                  {active === id && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 36 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch locale={locale} label={dict.a11y.language} />
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={cx(button.icon, "max-sm:hidden")}
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className={cx(button.icon, "max-sm:hidden")}
          >
            <LinkedinIcon size={15} />
          </a>
          {resumeUrl && (
            <a href={resumeUrl} download className={cx(button.small, "max-md:hidden")}>
              <FileText size={15} aria-hidden="true" />
              {dict.actions.resume}
            </a>
          )}
          <button
            type="button"
            className={cx(button.icon, "xl:hidden")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.a11y.closeMenu : dict.a11y.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label={dict.a11y.mainNav}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border-t border-line xl:hidden"
          >
            <div className="container-page py-4">
              <ul className="grid gap-1 sm:grid-cols-2">
                {sections.map((id) => (
                  <li key={id}>
                    <Link
                      href={sectionHref(id)}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-[15px] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                    >
                      {dict.nav[id]}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                {resumeUrl && (
                  <a href={resumeUrl} download className={button.small}>
                    <FileText size={15} aria-hidden="true" />
                    {dict.actions.downloadResume}
                  </a>
                )}
                <a href={profile.links.github} target="_blank" rel="noreferrer" className={button.small}>
                  <GithubIcon size={15} />
                  GitHub
                </a>
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className={button.small}>
                  <LinkedinIcon size={14} />
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
