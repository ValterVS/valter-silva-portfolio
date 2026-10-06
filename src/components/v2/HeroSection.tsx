"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { RefObject } from "react";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import type { ImmersiveContent } from "./content";

type HeroProps = {
  sectionRef: RefObject<HTMLElement | null>;
  progress: MotionValue<number>;
  ui: ImmersiveDictionary;
  content: ImmersiveContent;
};

// Composição tipográfica do lado direito. drift é para onde a palavra atravessa a tela ao rolar.
const composition = [
  { word: "Java", className: "text-[7.4vw] font-semibold text-gold", indent: "ml-0", drift: -45 },
  { word: "Spring", className: "text-[4.4vw] font-medium text-outline text-fg/60", indent: "ml-[5vw]", drift: 30 },
  { word: "API", className: "text-[3.1vw] font-medium text-fg/85", indent: "ml-[1vw]", drift: -25 },
  { word: "SQL", className: "text-[6.2vw] font-semibold text-outline text-gold/80", indent: "ml-[8vw]", drift: 40 },
  { word: "Docker", className: "font-mono text-[1.15vw] tracking-[0.45em] text-faint", indent: "ml-[2.5vw]", drift: -15 },
];

function DriftingWord({
  item,
  progress,
}: {
  item: (typeof composition)[number];
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, [0, 1], ["0vw", `${item.drift}vw`]);
  const opacity = useTransform(progress, [0, 0.75], [1, 0]);
  return (
    <motion.span style={{ x, opacity }} className={`block leading-[0.95] tracking-[-0.02em] uppercase ${item.indent} ${item.className}`}>
      {item.word}
    </motion.span>
  );
}

export function HeroSection({ sectionRef, progress, ui, content }: HeroProps) {
  const [first, ...rest] = content.name.split(" ");
  const nameY = useTransform(progress, [0, 1], ["0vh", "-18vh"]);
  const nameOpacity = useTransform(progress, [0.2, 0.85], [1, 0]);
  const nameScale = useTransform(progress, [0, 1], [1, 0.92]);
  const cueOpacity = useTransform(progress, [0, 0.15], [1, 0]);
  const words = composition.map((item) => item.word).join(", ");

  return (
    <section ref={sectionRef} aria-labelledby="v2-name" className="relative h-[150dvh]">
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden px-5 pt-24 pb-10 sm:px-8 lg:px-14">
        <motion.div
          style={{ y: nameY, opacity: nameOpacity, scale: nameScale }}
          className="relative z-10 flex flex-col max-lg:items-center max-lg:text-center lg:absolute lg:bottom-[22%] lg:left-14 lg:max-w-[38vw] lg:origin-bottom-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-mono text-xs tracking-[0.3em] text-gold uppercase"
          >
            {ui.hero.greeting}
          </motion.p>
          <h1 id="v2-name" className="mt-4 text-[clamp(3rem,13vw,4.5rem)] leading-[0.86] font-semibold tracking-[-0.04em] uppercase whitespace-nowrap lg:text-[clamp(4rem,7.2vw,8.5rem)]">
            <motion.span
              initial={{ opacity: 0, y: "40%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {first}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: "40%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.47, ease: [0.22, 1, 0.36, 1] }}
              className="block text-fg/45"
            >
              {rest.join(" ")}
            </motion.span>
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
          >
            <p className="mt-5 text-lg font-medium text-fg sm:text-xl">{content.role}</p>
            <p className="mt-3 hidden max-w-sm text-sm leading-relaxed text-pretty text-muted xl:block">
              {content.headline}
            </p>
          </motion.div>
        </motion.div>

        <div className="hidden lg:absolute lg:top-[17%] lg:right-14 lg:block lg:w-[30vw]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-muted uppercase"
          >
            <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
            {ui.hero.side}
          </motion.p>
          <p className="sr-only">
            {ui.hero.stackLabel}: {words}
          </p>
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {composition.map((item) => (
              <DriftingWord key={item.word} item={item} progress={progress} />
            ))}
          </motion.div>
        </div>

        <motion.p
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 mt-4 text-center font-mono text-[11px] tracking-[0.35em] text-faint uppercase lg:hidden"
        >
          {composition.map((item) => item.word).join(" · ")}
        </motion.p>

        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] text-faint uppercase">{ui.hero.scroll}</span>
          <span className="relative h-10 w-px overflow-hidden bg-fg/15" aria-hidden="true">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-gold" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
