"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function RoleTicker({ roles }: { roles: string[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || roles.length < 2) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % roles.length), 2600);
    return () => clearInterval(timer);
  }, [reduce, roles.length]);

  return (
    <>
      <span className="sr-only">{roles.join(" · ")}</span>
      <span aria-hidden="true" className="relative inline-grid h-[1.25em] overflow-hidden align-bottom">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={roles[index]}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="col-start-1 row-start-1 whitespace-nowrap"
          >
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}
