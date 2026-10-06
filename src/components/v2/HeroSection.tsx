"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import { cx } from "@/lib/styles";

export type HeroContent = { name: string; role: string; headline: string };

// Palavras da composição da direita. Ficam numa camada atrás do avatar e nunca à esquerda dele,
// para não competir com o nome. O x parte do centro da tela em vh, porque a largura do avatar
// acompanha a altura da tela; assim a distância até ele é a mesma em 1366, 1440 ou 1920 px.
// lg = 1024+ (avatar um pouco menor), xl = 1280+.
// exit: como cada palavra sai durante o scroll da hero; fade = início e fim do fade, em progresso da hero.
const stack = [
  {
    word: "Java",
    className: "text-[clamp(3.5rem,6vw,7.5rem)] font-semibold text-gold",
    position: "lg:left-[calc(50%+18vh)] lg:top-[24%] xl:left-[calc(50%+22vh)] xl:top-[22%]",
    exit: { x: "2vw", y: "-24vh", scale: 1, fade: [0.3, 0.75] },
  },
  {
    word: "Spring",
    className: "text-[clamp(2.25rem,3.8vw,4.75rem)] font-medium text-outline text-fg/60",
    position: "lg:left-[calc(50%+28vh)] lg:top-[36%] xl:left-[calc(50%+33vh)] xl:top-[34%]",
    exit: { x: "16vw", y: "-4vh", scale: 1, fade: [0.35, 0.8] },
  },
  {
    word: "API",
    className: "text-[clamp(1.6rem,2.6vw,3.25rem)] font-medium text-fg/80",
    position: "lg:left-[calc(50%+22vh)] lg:top-[47%] xl:left-[calc(50%+25vh)] xl:top-[45%]",
    exit: { x: "3vw", y: "-6vh", scale: 0.7, fade: [0.25, 0.7] },
  },
  {
    word: "SQL",
    className: "text-[clamp(3rem,5.2vw,6.5rem)] font-semibold text-outline text-gold/80",
    position: "lg:left-[calc(50%+35vh)] lg:top-[49%] xl:left-[calc(50%+44vh)] xl:top-[48%]",
    exit: { x: "6vw", y: "12vh", scale: 1, fade: [0.4, 0.85] },
  },
  {
    word: "Docker",
    className: "font-mono text-[clamp(0.7rem,1vw,1.25rem)] tracking-[0.45em] text-faint",
    position: "lg:left-[calc(50%+23vh)] lg:top-[63%] xl:left-[calc(50%+28vh)] xl:top-[62%]",
    exit: { x: "2vw", y: "-3vh", scale: 1, fade: [0.2, 0.6] },
  },
];

// As faixas sempre cobrem de 0 a 1. O Motion acelera essas animações com ViewTimeline nativo, e uma
// faixa parcial (ex.: [0, 0.55]) deixa o fim sem keyframe: o navegador volta ao valor original
// (opacity 1) e a palavra reaparece depois da hero.
function StackWord({ item, progress }: { item: (typeof stack)[number]; progress: MotionValue<number> }) {
  const [fadeStart, fadeEnd] = item.exit.fade;
  const x = useTransform(progress, [0, fadeEnd, 1], ["0vw", item.exit.x, item.exit.x]);
  const y = useTransform(progress, [0, fadeEnd, 1], ["0vh", item.exit.y, item.exit.y]);
  const scale = useTransform(progress, [0, fadeEnd, 1], [1, item.exit.scale, item.exit.scale]);
  const opacity = useTransform(progress, [0, fadeStart, fadeEnd, 1], [1, 1, 0, 0]);
  return (
    <motion.span
      style={{ x, y, scale, opacity }}
      className={cx(
        "absolute origin-left leading-[0.95] tracking-[-0.02em] whitespace-nowrap uppercase",
        item.position,
        item.className,
      )}
    >
      {item.word}
    </motion.span>
  );
}

// Camada intermediária (fundo → palavras → avatar → texto da hero). Não é fixa na página: fica presa
// num trecho com a mesma altura da hero (150svh) e sai junto com ela, então nunca chega às outras seções.
export function HeroStack({ progress }: { progress: MotionValue<number> }) {
  const visibility = useTransform(progress, (value) => (value > 0.97 ? "hidden" : "visible"));
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[5] hidden h-[150svh] lg:block">
      <motion.div
        style={{ visibility }}
        className="sticky top-0 h-svh animate-[fade-in_1s_ease_0.5s_both] overflow-hidden"
      >
        {stack.map((item) => (
          <StackWord key={item.word} item={item} progress={progress} />
        ))}
      </motion.div>
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
  const nameOpacity = useTransform(progress, [0, 0.05, 0.6, 1], [1, 1, 0, 0]);
  const nameScale = useTransform(progress, [0, 1], [1, 0.92]);
  const cueOpacity = useTransform(progress, [0, 0.12, 1], [1, 0, 0]);
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
