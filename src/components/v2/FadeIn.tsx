"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Entrada das seções da V2: dispara assim que o bloco aponta na parte de baixo da tela e termina rápido,
// para a interface reagir junto com o scroll e não depois dele.
export function FadeIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -4% 0px" }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
