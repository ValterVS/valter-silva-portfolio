"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";

type PortraitProps = {
  src: string;
  alt: string;
  hero: MotionValue<number>;
  tech: MotionValue<number>;
  contact: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  compact: boolean;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

// Retrato como imagem comum: só translada, muda de escala como um todo e faz fade. Nada de perspectiva,
// então o rosto nunca deforma. Grande na hero, menor ao lado do "Sobre", some nas seções técnicas
// e volta discreto no contato. O enquadramento vem do container (aspect 4/5 + object-cover), não da foto:
// trocar public/models/valter-portrait.* não exige mexer aqui.
export function Portrait({ src, alt, hero, tech, contact, pointer, compact }: PortraitProps) {
  const x = useTransform(() => {
    const side = compact ? 0 : ease(hero.get()) * 25;
    return `calc(${side}vw + ${pointer.x.get() * 8}px)`;
  });
  const y = useTransform(() => `calc(${compact ? 0 : ease(hero.get()) * 4}vh + ${pointer.y.get() * 5}px)`);
  const scale = useTransform(() => (compact ? 1 : 1 - ease(hero.get()) * 0.38));
  const opacity = useTransform(() => {
    if (compact) return 1 - ease(hero.get() / 0.8);
    const leaving = 1 - ease((tech.get() - 0.02) / 0.08);
    return Math.max(leaving, ease((contact.get() - 0.4) / 0.6));
  });
  const visibility = useTransform(opacity, (value) => (value < 0.01 ? "hidden" : "visible"));

  return (
    <div className="pointer-events-none fixed inset-0 z-[12]">
      <motion.div
        style={{ x, y, scale, opacity, visibility }}
        className="portrait-mask absolute bottom-0 left-1/2 aspect-[4/5] h-[46%] -translate-x-1/2 origin-[50%_30%] lg:left-[58%] lg:top-[22.9%] lg:bottom-auto lg:h-[81.38%] xl:left-1/2 xl:top-[15.17%] xl:h-[92.55%]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          preload
          fetchPriority="high"
          sizes="(min-width: 1280px) 74vh, (min-width: 1024px) 65vh, 45vh"
          className="object-cover object-top"
        />
      </motion.div>
    </div>
  );
}
