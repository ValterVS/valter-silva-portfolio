"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { htmlLang, locales, type Locale } from "@/i18n/config";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import { useSwitchLocale } from "@/lib/locale-switch";
import { cx } from "@/lib/styles";
import type { ImmersiveContent } from "./content";

type HeaderProps = {
  locale: Locale;
  ui: ImmersiveDictionary;
  resumeUrl: string | null;
  links: ImmersiveContent["links"];
};

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function LocaleToggle({ locale, label }: { locale: Locale; label: string }) {
  const switchLocale = useSwitchLocale();
  return (
    <div role="group" aria-label={label} className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.2em]">
      {locales.map((option, index) => (
        <span key={option} className="flex items-center gap-1.5">
          {index > 0 && (
            <span className="text-fg/25" aria-hidden="true">
              /
            </span>
          )}
          <button
            type="button"
            lang={htmlLang[option]}
            aria-pressed={option === locale}
            onClick={() => option !== locale && switchLocale(option)}
            className={cx(
              "uppercase transition-colors",
              option === locale ? "text-fg" : "text-fg/40 hover:text-fg/80",
            )}
          >
            {option}
          </button>
        </span>
      ))}
    </div>
  );
}

export function V2Header({ locale, ui, resumeUrl, links }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeToScroll, () => window.scrollY > 40, () => false);
  const nav = [
    { id: "about", label: ui.nav.about },
    { id: "work", label: ui.nav.work },
    { id: "contact", label: ui.nav.contact },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-200",
        scrolled || open ? "bg-ink/75 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="flex h-20 items-center justify-between px-5 sm:px-8 lg:px-14">
        <a href="#content" className="group flex items-baseline gap-1 text-sm font-semibold tracking-[0.3em] uppercase">
          Valter
          <span className="size-1.5 rounded-full bg-gold transition-transform group-hover:scale-125" aria-hidden="true" />
        </a>

        <p className="absolute left-1/2 hidden -translate-x-1/2 font-mono text-[11px] tracking-[0.25em] text-fg/35 xl:block">
          valtersilva.dev.br
        </p>

        <div className="flex items-center gap-8">
          <nav aria-label={ui.nav.main} className="hidden lg:block">
            <ul className="flex gap-8">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="relative font-mono text-[11px] tracking-[0.25em] text-fg/70 uppercase transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-[width] after:duration-300 hover:text-fg hover:after:w-full"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <LocaleToggle locale={locale} label={ui.nav.language} />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="v2-menu"
            onClick={() => setOpen((value) => !value)}
            className="font-mono text-[11px] tracking-[0.25em] text-fg uppercase lg:hidden"
          >
            {open ? ui.nav.close : ui.nav.menu}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="v2-menu"
            aria-label={ui.nav.main}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-20 flex flex-col justify-between bg-ink/95 px-5 pt-10 pb-12 backdrop-blur-md sm:px-8 lg:hidden"
          >
            <ul className="space-y-2">
              {nav.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + index * 0.06 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="block text-5xl font-semibold tracking-tight uppercase transition-colors hover:text-gold"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] tracking-[0.25em] uppercase">
              {resumeUrl && (
                <a href={resumeUrl} download className="text-gold">
                  {ui.resume} ↗
                </a>
              )}
              <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-fg/70">
                <GithubIcon size={18} />
              </a>
              <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-fg/70">
                <LinkedinIcon size={17} />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
