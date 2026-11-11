import type { HomeDictionary } from "@/i18n/home";
import { textLink } from "./ui";

type ContactProps = {
  ui: HomeDictionary;
  email: string;
  links: { github: string; linkedin: string };
  resumeUrl: string | null;
};

const display = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export function Contact({ ui, email, links, resumeUrl }: ContactProps) {
  const rows = [
    { label: ui.contact.email, href: `mailto:${email}`, text: email, external: false },
    { label: "GitHub", href: links.github, text: display(links.github), external: true },
    { label: "LinkedIn", href: links.linkedin, text: display(links.linkedin), external: true },
  ];

  return (
    <>
      <p className="max-w-measure text-lead text-pretty">{ui.contact.text}</p>
      <dl className="mt-block border-t border-border">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-x-8 border-b border-border py-2 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center">
            <dt className="pt-2 text-small text-foreground-muted sm:pt-0">{row.label}</dt>
            <dd>
              <a
                href={row.href}
                {...(row.external && { target: "_blank", rel: "noreferrer" })}
                className={`${textLink} inline-flex min-h-11 items-center break-all`}
              >
                {row.text}
              </a>
            </dd>
          </div>
        ))}
        {resumeUrl && (
          <div className="grid gap-x-8 border-b border-border py-2 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center">
            <dt className="pt-2 text-small text-foreground-muted sm:pt-0">{ui.contact.resume}</dt>
            <dd>
              <a href={resumeUrl} download type="application/pdf" className={`${textLink} inline-flex min-h-11 items-center`}>
                {ui.contact.resumeLink}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </>
  );
}
