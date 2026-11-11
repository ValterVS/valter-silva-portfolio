import type { ReactNode } from "react";

// Seção editorial: divisória fina no topo, título à esquerda no desktop e conteúdo à direita.
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className="border-t border-border py-section">
      <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <h2 id={headingId} className="font-display text-title text-balance">
          {title}
        </h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
