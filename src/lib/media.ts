import { useSyncExternalStore } from "react";

export type Quality = "full" | "lite" | "none";

let detected: Quality | undefined;

// WebGL desenhado pela CPU (sem GPU, ou GPU bloqueada pelo navegador). Nesses casos a cena derruba
// a página inteira para poucos quadros por segundo, então fica só a imagem estática.
const softwareRenderer = /swiftshader|llvmpipe|softpipe|software|basic render/i;

// Nível de detalhe do 3D, decidido uma vez: sem WebGL acelerado → nada, tela pequena ou aparelho modesto → leve.
function detectQuality(): Quality {
  if (detected) return detected;
  const canvas = document.createElement("canvas");
  const options: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true };
  const gl = canvas.getContext("webgl2", options) ?? canvas.getContext("webgl", options);
  if (!gl) return (detected = "none");
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  if (softwareRenderer.test(renderer)) return (detected = "none");

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
