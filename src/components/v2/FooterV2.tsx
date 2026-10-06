import { ArrowUp } from "lucide-react";
import Link from "next/link";
import type { ImmersiveDictionary } from "@/i18n/immersive";

type FooterProps = {
  ui: ImmersiveDictionary;
  name: string;
  role: string;
  classicHref: string;
};

export function FooterV2({ ui, name, role, classicHref }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-30 border-t border-fg/[0.08] px-5 py-8 sm:px-8 lg:px-14">
      <div className="flex flex-col gap-4 font-mono text-[10px] tracking-[0.28em] text-faint uppercase sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-fg">{name}</span> · {role} · {year}
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
