import { ArrowUp, Mail } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/ui";
import { profile } from "@/data/profile";
import { button } from "@/lib/styles";
import { GithubIcon, LinkedinIcon } from "./icons";

const year = new Date().getFullYear();

// top: link do botão de voltar ao topo (home + âncora da hero).
export function Footer({ locale, dict, top }: { locale: Locale; dict: Dictionary; top: string }) {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-fg">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">
            {profile.role} · {profile.location[locale]}
          </p>
          <p className="mt-3 font-mono text-xs text-faint">
            © {year} {profile.brand}. {dict.footer.rights}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className={button.icon}>
            <GithubIcon size={16} />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={button.icon}>
            <LinkedinIcon size={15} />
          </a>
          <a href={`mailto:${profile.email}`} aria-label={profile.email} className={button.icon}>
            <Mail size={16} aria-hidden="true" />
          </a>
          <Link href={top} aria-label={dict.a11y.backToTop} className={button.icon}>
            <ArrowUp size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
