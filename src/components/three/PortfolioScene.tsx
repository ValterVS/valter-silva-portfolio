"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import { FloatingTech } from "./FloatingTech";
import { SceneLights } from "./SceneLights";
import { SceneParticles } from "./SceneParticles";
import { ValterAvatar, type AvatarAssets, type Pointer } from "./ValterAvatar";

export type SceneProgress = {
  hero: MotionValue<number>;
  tech: MotionValue<number>;
  contact: MotionValue<number>;
};

type PortfolioSceneProps = {
  avatar: AvatarAssets;
  portraitSrc: string | null;
  progress: SceneProgress;
  pointer: Pointer;
  quality: "full" | "lite";
  compact: boolean;
  animate: boolean;
  active: boolean;
  onReady: () => void;
};

type Pose = { x: number; y: number; z: number; rotY: number; scale: number };

// Posição do avatar em cada momento da página. Ajuste aqui para mudar a coreografia do scroll.
const poses: Record<"wide" | "compact", Record<"hero" | "about" | "stack" | "contact", Pose>> = {
  wide: {
    hero: { x: 0, y: -0.02, z: 0, rotY: 0, scale: 1.04 },
    about: { x: 1.6, y: -0.1, z: 0.1, rotY: -0.5, scale: 0.95 },
    stack: { x: 0.1, y: -0.2, z: -0.5, rotY: 0.2, scale: 0.9 },
    contact: { x: 1.7, y: -0.15, z: 0, rotY: -0.45, scale: 0.95 },
  },
  compact: {
    hero: { x: 0, y: -0.55, z: 0, rotY: 0, scale: 0.92 },
    about: { x: 0, y: -0.8, z: -0.3, rotY: -0.25, scale: 0.85 },
    stack: { x: 0, y: -0.6, z: -0.5, rotY: 0.2, scale: 0.85 },
    contact: { x: 0, y: -1.7, z: 0, rotY: 0, scale: 0.85 },
  },
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

function mix(a: Pose, b: Pose, t: number): Pose {
  const lerp = (from: number, to: number) => from + (to - from) * t;
  return {
    x: lerp(a.x, b.x),
    y: lerp(a.y, b.y),
    z: lerp(a.z, b.z),
    rotY: lerp(a.rotY, b.rotY),
    scale: lerp(a.scale, b.scale),
  };
}

function Choreography({
  progress,
  compact,
  animate,
  yaw,
  children,
}: {
  progress: SceneProgress;
  compact: boolean;
  animate: boolean;
  yaw: number;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const placed = useRef(false);

  useFrame(({ camera, size }, delta) => {
    const set = compact ? poses.compact : poses.wide;
    // Entre 1024 e 1280 px o avatar diminui um pouco para não encostar no texto das laterais.
    const start = !compact && size.width < 1280 ? { ...set.hero, y: set.hero.y - 0.15, scale: set.hero.scale * 0.88 } : set.hero;
    const hero = smooth(progress.hero.get());
    const tech = progress.tech.get();
    const stack = smooth(tech / 0.3);

    let pose = mix(start, set.about, hero);
    pose = mix(pose, set.stack, stack);
    pose.rotY += Math.max(0, tech - 0.3) * 0.7;
    pose = mix(pose, set.contact, smooth(progress.contact.get()));
    if (!animate) pose = { ...start };
    pose.rotY *= yaw;

    const cameraZ = (compact ? 9.4 : 7.6) - hero * 0.35 + stack * 0.45;
    const g = group.current;
    if (!g) return;

    // O primeiro quadro já nasce na pose certa (casa com a imagem da hero). Depois, um amortecimento curto
    // só para suavizar o scroll, sem a sensação de o avatar correr atrás da página.
    const rate = animate && placed.current ? 7 : Infinity;
    placed.current = true;
    g.position.x = THREE.MathUtils.damp(g.position.x, pose.x, rate, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, pose.y, rate, delta);
    g.position.z = THREE.MathUtils.damp(g.position.z, pose.z, rate, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pose.rotY, rate, delta);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, pose.scale, rate, delta));
    camera.position.z = THREE.MathUtils.damp(camera.position.z, animate ? cameraZ : compact ? 9.4 : 7.6, rate, delta);
  });

  return <group ref={group}>{children}</group>;
}

// Configuração da cena 3D
export default function PortfolioScene({
  avatar,
  portraitSrc,
  progress,
  pointer,
  quality,
  compact,
  animate,
  active,
  onReady,
}: PortfolioSceneProps) {
  const lite = quality === "lite";
  // O retrato em relevo não aguenta giros grandes, então a coreografia gira menos.
  const yaw = avatar.model || !avatar.portrait ? 1 : 0.22;

  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 1.5]}
      camera={{ position: [0, 0.25, compact ? 9.4 : 7.6], fov: 32 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      frameloop={!active ? "never" : animate ? "always" : "demand"}
      style={{ pointerEvents: "none" }}
    >
      <fog attach="fog" args={["#080b11", 8, 16]} />
      <SceneLights />
      <Choreography progress={progress} compact={compact} animate={animate} yaw={yaw}>
        <ValterAvatar assets={avatar} portraitSrc={portraitSrc} pointer={pointer} animate={animate} onReady={onReady} />
      </Choreography>
      {!lite && <FloatingTech tech={progress.tech} pointer={pointer} animate={animate} />}
      <SceneParticles count={lite ? 90 : 260} pointer={pointer} animate={animate} />
    </Canvas>
  );
}
