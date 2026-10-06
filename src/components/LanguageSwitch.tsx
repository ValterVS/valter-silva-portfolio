"use client";

import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { htmlLang, isLocale, localeCookie, localePath, locales, type Locale } from "@/i18n/config";
import { cx } from "@/lib/styles";

function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  if (!isLocale(segments[1] ?? "")) return pathname;
  return "/" + segments.slice(2).join("/");
}

export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = useState(locale);

  function select(next: Locale) {
    if (next === selected) return;
    setSelected(next);
    document.cookie = `${localeCookie}=${next}; path=/; max-age=31536000; samesite=lax`;
    const target = localePath(next, stripLocale(pathname)) + window.location.hash;
    router.push(target, { scroll: false });
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="flex h-9 items-center rounded-full border border-line bg-surface/80 p-0.5 font-mono text-[11px] tracking-wider"
    >
      {locales.map((option) => {
        const active = option === selected;
        return (
          <button
            key={option}
            type="button"
            lang={htmlLang[option]}
            aria-pressed={active}
            onClick={() => select(option)}
            className={cx(
              "relative h-8 w-10 rounded-full uppercase transition-colors",
              active ? "text-fg" : "text-faint hover:text-muted",
            )}
          >
            {active && (
              <motion.span
                layoutId="language-pill"
                className="absolute inset-0 rounded-full bg-accent/15 ring-1 ring-accent/40"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
