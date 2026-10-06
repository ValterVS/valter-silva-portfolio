"use client";

import { Check, Copy, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/ui";
import { profile } from "@/data/profile";
import { button, cx } from "@/lib/styles";
import { GithubIcon, LinkedinIcon } from "./icons";

type ContactProps = {
  locale: Locale;
  dict: Pick<Dictionary, "contact" | "actions">;
};

const field =
  "w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-[15px] text-fg placeholder:text-faint transition-colors outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20";

export function Contact({ locale, dict }: ContactProps) {
  const [copied, setCopied] = useState(false);
  const labels = dict.contact;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  // O formulário não depende de backend: monta a mensagem e abre o app de e-mail do visitante.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `${labels.form.subject} — ${name}`;
    const body = `${message}\n\n${name}\n${email}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const channels = [
    { icon: LinkedinIcon, label: "LinkedIn", href: profile.links.linkedin },
    { icon: GithubIcon, label: "GitHub", href: profile.links.github },
  ].map((channel) => ({ ...channel, value: new URL(channel.href).pathname.replace(/\/$/, "") }));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
      <div className="space-y-4">
        <div className="card p-5 sm:p-6">
          <p className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">{labels.email}</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-w-0 items-center gap-2 text-lg font-medium break-all text-fg transition-colors hover:text-accent-soft"
            >
              <Mail size={18} className="shrink-0 text-accent" aria-hidden="true" />
              {profile.email}
            </a>
            <button type="button" onClick={copyEmail} className={button.small} aria-live="polite">
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? dict.actions.copied : dict.actions.copy}
            </button>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {channels.map(({ icon: Icon, label, value, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="card group flex items-center gap-4 p-5 transition-colors hover:border-accent/30"
              >
                <span className="grid size-10 place-items-center rounded-lg border border-line bg-surface-2 text-fg transition-colors group-hover:text-accent">
                  <Icon size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[11px] tracking-[0.16em] text-faint uppercase">{label}</span>
                  <span className="block truncate text-[15px] text-fg">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="card flex flex-wrap gap-x-8 gap-y-3 p-5 text-[15px] text-muted">
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} className="text-accent" aria-hidden="true" />
            {profile.location[locale]}
          </span>
          {profile.showPhone && profile.phone && (
            <a
              href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-2 hover:text-fg"
            >
              <Phone size={16} className="text-accent" aria-hidden="true" />
              {profile.phone}
            </a>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">{labels.form.name}</span>
            <input name="name" required autoComplete="name" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">{labels.form.email}</span>
            <input name="email" type="email" required autoComplete="email" className={field} />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">{labels.form.message}</span>
          <textarea name="message" required rows={6} className={cx(field, "resize-y")} />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-faint">{labels.form.hint}</p>
          <button type="submit" className={button.primary}>
            <Send size={15} aria-hidden="true" />
            {labels.form.send}
          </button>
        </div>
      </form>
    </div>
  );
}
