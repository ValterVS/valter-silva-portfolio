"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { ImmersiveDictionary } from "@/i18n/immersive";

// Tela de entrada enquanto o 3D carrega. Nunca segura o conteúdo por mais de 2,2 s.
export function Loader({ ui, done }: { ui: ImmersiveDictionary; done: boolean }) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExpired(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!done && !expired && (
        <motion.div
          aria-hidden="true"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-0 z-[60] flex animate-[loader-out_0.6s_ease_2.4s_forwards] flex-col items-center justify-center gap-6 bg-ink"
        >
          <p className="text-3xl font-semibold tracking-[0.35em] uppercase">
            VS<span className="text-gold">.</span>
          </p>
          <div className="h-px w-40 overflow-hidden bg-fg/10">
            <motion.div
              className="h-full bg-gold"
              initial={{ width: "0%" }}
              animate={{ width: "90%" }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="font-mono text-[10px] tracking-[0.35em] text-faint uppercase">{ui.loading}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
