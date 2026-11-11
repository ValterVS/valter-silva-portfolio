import type { HomeDictionary } from "@/i18n/home";
import { profile } from "@/data/profile";

export function SiteFooter({ ui }: { ui: HomeDictionary }) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-6 border-t border-border py-6 text-small text-foreground-muted">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <a href="#top" className="inline-flex min-h-11 items-center transition-colors hover:text-primary">
        {ui.footer.top} ↑
      </a>
    </footer>
  );
}
