"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

// Botão de copiar o e-mail: a única parte interativa da seção de contato.
export function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-muted uppercase transition-colors hover:text-fg"
    >
      {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
      {copied ? done : label}
    </button>
  );
}
