"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SceneFallback } from "./SceneFallback";
import type { Quality } from "./HeroScene";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

let detected: Quality | "none" | undefined;

// Decide uma única vez o nível de detalhe da cena: sem WebGL → SVG, tela pequena ou aparelho modesto → versão leve.
function detectQuality() {
  if (detected) return detected;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  if (!gl) return (detected = "none");
  gl.getExtension("WEBGL_lose_context")?.loseContext();

  const nav = navigator as Navigator & { deviceMemory?: number };
  const modest = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  const small = window.matchMedia("(max-width: 767px)").matches;
  return (detected = small || modest ? "lite" : "full");
}

// O nível de detalhe não muda depois de detectado, então não há o que observar.
const subscribeOnce = () => () => undefined;

function subscribeToMotionPreference(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function HeroVisual({ label }: { label: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  const quality = useSyncExternalStore(subscribeOnce, detectQuality, () => null);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const showScene = quality === "full" || quality === "lite";

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
