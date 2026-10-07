"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useAfterLoad } from "@/lib/idle";
import { useQuality, useReducedMotion } from "@/lib/media";
import { SceneFallback } from "./SceneFallback";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function HeroVisual({ label }: { label: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  // Mesma detecção da home: sem WebGL acelerado, fica a versão em SVG.
  const quality = useQuality();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const loaded = useAfterLoad(quality === null || quality === "none" ? null : "idle");
  const showScene = loaded && (quality === "full" || quality === "lite");

  return (
    <div ref={container} role="img" aria-label={label} className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: showScene && ready ? 0 : 1 }}
      >
        <SceneFallback />
      </div>
      {showScene && (
        <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: ready ? 1 : 0 }}>
          <HeroScene
            quality={quality}
            animate={!reducedMotion}
            active={visible}
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  );
}
