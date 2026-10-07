"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

// Único trecho interativo do painel de projeto: o título acompanha levemente o cursor (via --mx/--my).
// O conteúdo continua vindo do servidor como children.
export function TiltPanel({ className, children }: { className: string; children: ReactNode }) {
  const panel = useRef<HTMLElement>(null);

  function track(event: PointerEvent<HTMLElement>) {
    const element = panel.current;
    if (!element || event.pointerType !== "mouse") return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--mx", String((event.clientX - rect.left) / rect.width - 0.5));
    element.style.setProperty("--my", String((event.clientY - rect.top) / rect.height - 0.5));
  }

  function reset() {
    panel.current?.style.setProperty("--mx", "0");
    panel.current?.style.setProperty("--my", "0");
  }

  return (
    <article ref={panel} onPointerMove={track} onPointerLeave={reset} className={className}>
      {children}
    </article>
  );
}
