import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useRef } from "react";

export type Pointer = { x: MotionValue<number>; y: MotionValue<number> };

export type PartProps = { pointer: Pointer; animate: boolean; onReady: () => void };

// Altura e topo do avatar na cena. O GLB é escalado para caber nesse espaço.
export const AVATAR_HEIGHT = 2.9;
export const AVATAR_TOP = 1.12;

// Rotação máxima em resposta ao cursor (radianos): alguns graus, nada mais.
export const LOOK_YAW = 0.12;
export const LOOK_PITCH = 0.05;

// Avisa a página no primeiro quadro desenhado, para a troca da imagem da hero pelo 3D acontecer sem flash.
export function useFirstFrame(onReady: () => void) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    onReady();
  });
}
