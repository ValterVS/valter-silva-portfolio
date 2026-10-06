import { useSyncExternalStore } from "react";

export type Quality = "full" | "lite" | "none";

let detected: Quality | undefined;

// Nível de detalhe do 3D, decidido uma vez: sem WebGL → nada, tela pequena ou aparelho modesto → leve.
function detectQuality(): Quality {
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

const subscribeNever = () => () => undefined;

export function useQuality() {
  return useSyncExternalStore(subscribeNever, detectQuality, () => null);
}

function mediaStore(query: string) {
  const subscribe = (callback: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", callback);
    return () => list.removeEventListener("change", callback);
  };
  const get = () => window.matchMedia(query).matches;
  return { subscribe, get };
}

const reducedMotion = mediaStore("(prefers-reduced-motion: reduce)");
const compactScreen = mediaStore("(max-width: 1023px)");
const finePointer = mediaStore("(hover: hover) and (pointer: fine)");

export function useReducedMotion() {
  return useSyncExternalStore(reducedMotion.subscribe, reducedMotion.get, () => false);
}

export function useCompact() {
  return useSyncExternalStore(compactScreen.subscribe, compactScreen.get, () => false);
}

export function useFinePointer() {
  return useSyncExternalStore(finePointer.subscribe, finePointer.get, () => false);
}
