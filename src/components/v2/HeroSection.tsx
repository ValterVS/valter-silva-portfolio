"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import { cx } from "@/lib/styles";

export type HeroContent = { name: string; role: string; headline: string };

// Palavras da composição da direita. Ficam numa camada atrás do avatar e nunca à esquerda dele,
// para não competir com o nome. O x parte do centro da tela em vh, porque a largura do avatar
// acompanha a altura da tela; assim a distância até ele é a mesma em 1366, 1440 ou 1920 px.
// lg = 1024+ (avatar um pouco menor), xl = 1280+.
const stack = [
  {
    word: "Java",
    className: "text-[clamp(3.5rem,6vw,7.5rem)] font-semibold text-gold",
    position: "lg:left-[calc(50%+18vh)] lg:top-[24%] xl:left-[calc(50%+22vh)] xl:top-[22%]",
  },
  {
    word: "Spring",
    className: "text-[clamp(2.25rem,3.8vw,4.75rem)] font-medium text-outline text-fg/60",
    position: "lg:left-[calc(50%+28vh)] lg:top-[36%] xl:left-[calc(50%+33vh)] xl:top-[34%]",
  },
  {
    word: "API",
    className: "text-[clamp(1.6rem,2.6vw,3.25rem)] font-medium text-fg/80",
    position: "lg:left-[calc(50%+22vh)] lg:top-[47%] xl:left-[calc(50%+25vh)] xl:top-[45%]",
  },
  {
    word: "SQL",
    className: "text-[clamp(3rem,5.2vw,6.5rem)] font-semibold text-outline text-gold/80",
    position: "lg:left-[calc(50%+35vh)] lg:top-[49%] xl:left-[calc(50%+44vh)] xl:top-[48%]",
  },
  {
    word: "Docker",
    className: "font-mono text-[clamp(0.7rem,1vw,1.25rem)] tracking-[0.45em] text-faint",
    position: "lg:left-[calc(50%+23vh)] lg:top-[63%] xl:left-[calc(50%+28vh)] xl:top-[62%]",
  },
];

function StackWord({ item, index, progress }: { item: (typeof stack)[number]; index: number; progress: MotionValue<number> }) {
  // Ao rolar, as palavras sobem e saem pela direita, sempre longe do nome.
  const x = useTransform(progress, [0, 1], ["0vw", `${6 + index * 3}vw`]);
  const y = useTransform(progress, [0, 1], ["0vh", `${-8 - index * 2}vh`]);
  const opacity = useTransform(progress, [0, 0.55], [1, 0]);
  return (
    <motion.span
      style={{ x, y, opacity }}
      className={cx("absolute leading-[0.95] tracking-[-0.02em] whitespace-nowrap uppercase", item.position, item.className)}
    >
      {item.word}
    </motion.span>
  );
}

// Camada intermediária: fica atrás do avatar (z-5) e à frente do fundo.
export function HeroStack({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] hidden animate-[fade-in_1s_ease_0.5s_both] overflow-hidden lg:block"
    >
      {stack.map((item, index) => (
        <StackWord key={item.word} item={item} index={index} progress={progress} />
      ))}
    </div>
  );
}

type HeroProps = {
  progress: MotionValue<number>;
  ui: ImmersiveDictionary;
  content: HeroContent;
};

export function HeroSection({ progress, ui, content }: HeroProps) {
  const [first, ...rest] = content.name.split(" ");
  const nameY = useTransform(progress, [0, 1], ["0vh", "-18vh"]);
  const nameOpacity = useTransform(progress, [0.05, 0.6], [1, 0]);
  const nameScale = useTransform(progress, [0, 1], [1, 0.92]);
  const cueOpacity = useTransform(progress, [0, 0.12], [1, 0]);
  const words = stack.map((item) => item.word);

  return (
    <section id="hero" aria-labelledby="v2-name" className="relative h-[150svh]">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden px-5 pt-24 pb-10 sm:px-8 lg:px-14">
        <motion.div
          style={{ y: nameY, opacity: nameOpacity, scale: nameScale }}
          className="relative z-10 flex flex-col max-lg:items-center max-lg:text-center lg:absolute lg:bottom-[22%] lg:left-14 lg:max-w-[40vw] lg:origin-bottom-left"
        >
          <p className="animate-[rise-in_0.7s_ease_0.2s_both] font-mono text-xs tracking-[0.3em] text-gold uppercase">
            {ui.hero.greeting}
          </p>
          <h1
            id="v2-name"
            className="mt-4 text-[clamp(3rem,13vw,4.5rem)] leading-[0.86] font-semibold tracking-[-0.04em] whitespace-nowrap uppercase lg:text-[clamp(4rem,7.2vw,8.5rem)]"
          >
            <span className="block animate-[rise-in_0.8s_cubic-bezier(0.22,1,0.36,1)_0.25s_both]">{first}</span>
            <span className="block animate-[rise-in_0.8s_cubic-bezier(0.22,1,0.36,1)_0.35s_both] text-fg/45">
              {rest.join(" ")}
            </span>
          </h1>
          <div className="animate-[fade-in_0.8s_ease_0.55s_both]">
            <p className="mt-5 text-lg font-medium text-fg sm:text-xl">{content.role}</p>
            <p className="mt-3 hidden max-w-sm text-sm leading-relaxed text-pretty text-muted xl:block">
              {content.headline}
            </p>
          </div>
        </motion.div>

        <p className="absolute top-[15%] left-[61%] hidden animate-[fade-in_0.8s_ease_0.5s_both] items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-muted uppercase lg:left-[calc(50%+17vh)] lg:flex xl:left-[calc(50%+21vh)]">
          <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
          {ui.hero.side}
        </p>
        <p className="sr-only">
          {ui.hero.stackLabel}: {words.join(", ")}
        </p>

        <p
          aria-hidden="true"
          className="relative z-10 mt-4 animate-[fade-in_0.8s_ease_0.7s_both] text-center font-mono text-[11px] tracking-[0.35em] text-faint uppercase lg:hidden"
        >
          {words.join(" · ")}
        </p>

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
