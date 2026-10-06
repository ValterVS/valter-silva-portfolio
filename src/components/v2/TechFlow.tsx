"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { cx } from "@/lib/styles";
import type { FlowItem } from "./flow";

const WINDOW = 0.34;
const STEP = 0.065;

function RisingWord({
  item,
  index,
  progress,
}: {
  item: FlowItem;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.04 + index * STEP;
  const end = start + WINDOW;
  // Faixas sempre de 0 a 1: com uma faixa parcial, a animação nativa (ViewTimeline) volta para
  // opacity 1 fora da janela e a palavra aparece no meio da tela antes e depois da sua vez.
  const y = useTransform(progress, [0, start, end, 1], ["70vh", "70vh", "-70vh", "-70vh"]);
  const opacity = useTransform(progress, [0, start, start + 0.07, end - 0.1, end - 0.04, 1], [0, 0, 1, 1, 0, 0]);
  const front = item.depth === "front";
  const position = item.side === "left" ? { left: `${item.offset}%` } : { right: `${item.offset}%` };

  return (
    <motion.div
      style={{ y, opacity, ...position }}
      className={cx("absolute top-1/2 -translate-y-1/2", item.side === "right" && "text-right")}
    >
      <p
        className={cx(
          "leading-none font-semibold tracking-[-0.04em] whitespace-nowrap uppercase",
          front
            ? cx("text-[clamp(2.4rem,6.4vw,6.75rem)]", index % 4 === 1 ? "text-outline text-gold" : "text-fg/90")
            : "text-[clamp(3.5rem,11vw,11rem)] text-fg/[0.07]",
        )}
      >
        {item.name}
      </p>
      {front && item.usage && (
        <p className="mt-3 font-mono text-[10px] tracking-[0.3em] text-gold/80 uppercase">{item.usage}</p>
      )}
    </motion.div>
  );
}

// fade: some com a camada inteira quando a lista de tecnologias entra, para nada passar por cima dela.
export function TechLayer({
  depth,
  progress,
  fade,
  items,
}: {
  depth: FlowItem["depth"];
  progress: MotionValue<number>;
  fade: MotionValue<number>;
  items: FlowItem[];
}) {
  const opacity = useTransform(fade, [0, 0.5, 1], [1, 0, 0]);
  const visibility = useTransform(progress, (value) => (value <= 0 || value >= 1 ? "hidden" : "visible"));
  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, visibility }}
      className={cx(
        "pointer-events-none fixed inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_85%,transparent)]",
        depth === "back" ? "z-[5]" : "z-20",
      )}
    >
      {items.map((item, index) =>
        item.depth === depth ? <RisingWord key={item.name} item={item} index={index} progress={progress} /> : null,
      )}
    </motion.div>
  );
}
