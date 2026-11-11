"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";

type GalleryLabels = { gallery: string; previous: string; next: string };

// Galeria de capturas reais (declaradas em src/data/projects.ts). Sem imagens, não renderiza nada:
// o projeto aparece só com texto, sem imagem provisória.
export function ProjectGallery({ title, images, labels }: { title: string; images: string[]; labels: GalleryLabels }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  if (total === 0) return null;

  const step = (delta: number) => setIndex((current) => (current + delta + total) % total);
  function onKeyDown(event: KeyboardEvent) {
    if (total < 2) return;
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  }

  const control =
    "grid size-11 place-items-center rounded-control border border-border-strong bg-background text-foreground transition-colors hover:border-foreground";

  return (
    <div role="group" aria-roledescription="carousel" aria-label={labels.gallery} onKeyDown={onKeyDown}>
      <div className="relative aspect-video overflow-hidden border border-border bg-background-subtle">
        <Image
          src={images[index]}
          alt={`${title} — ${index + 1}/${total}`}
          fill
          sizes="(min-width: 1024px) 50rem, 100vw"
          className="object-contain"
        />
      </div>
      {total > 1 && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button type="button" onClick={() => step(-1)} aria-label={labels.previous} className={control}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <p aria-live="polite" className="text-small text-foreground-muted tabular-nums">
            {index + 1} / {total}
          </p>
          <button type="button" onClick={() => step(1)} aria-label={labels.next} className={control}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
