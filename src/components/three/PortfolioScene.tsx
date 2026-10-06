"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import { FloatingTech } from "./FloatingTech";
import { SceneLights } from "./SceneLights";
import { SceneParticles } from "./SceneParticles";
import { ValterAvatar, type Pointer } from "./ValterAvatar";

export type SceneProgress = {
  hero: MotionValue<number>;
  tech: MotionValue<number>;
  contact: MotionValue<number>;
};

type PortfolioSceneProps = {
  avatarUrl: string | null;
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
    hero: { x: 0, y: -0.4, z: 0, rotY: 0, scale: 0.9 },
    about: { x: 1.6, y: -0.35, z: 0.15, rotY: -0.5, scale: 0.9 },
    stack: { x: 0.1, y: -0.4, z: -0.5, rotY: 0.2, scale: 0.86 },
    contact: { x: 1.7, y: -0.4, z: 0, rotY: -0.45, scale: 0.9 },
  },
  compact: {
    hero: { x: 0, y: -0.75, z: 0, rotY: 0, scale: 0.8 },
    about: { x: 0, y: -0.95, z: -0.3, rotY: -0.25, scale: 0.75 },
    stack: { x: 0, y: -0.7, z: -0.5, rotY: 0.2, scale: 0.75 },
    contact: { x: 0, y: -0.95, z: 0, rotY: 0, scale: 0.75 },
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
  children,
}: {
  progress: SceneProgress;
  compact: boolean;
  animate: boolean;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ camera }, delta) => {
    const set = compact ? poses.compact : poses.wide;
    const hero = smooth(progress.hero.get());
    const tech = progress.tech.get();
    const stack = smooth(tech / 0.3);

    let pose = mix(set.hero, set.about, hero);
    pose = mix(pose, set.stack, stack);
    pose.rotY += Math.max(0, tech - 0.3) * 0.7;
    pose = mix(pose, set.contact, smooth(progress.contact.get()));
    if (!animate) pose = set.hero;

    const cameraZ = (compact ? 9.4 : 7.6) - hero * 0.35 + stack * 0.45;
    const g = group.current;
    if (!g) return;

    // Com movimento reduzido não há interpolação: o avatar fica parado na pose da hero.
    const rate = animate ? 2.4 : Infinity;
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
  avatarUrl,
  progress,
  pointer,
  quality,
  compact,
  animate,
  active,
  onReady,
}: PortfolioSceneProps) {
  const lite = quality === "lite";

  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 1.5]}
      camera={{ position: [0, 0.25, compact ? 9.4 : 7.6], fov: 32 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      frameloop={!active ? "never" : animate ? "always" : "demand"}
      onCreated={onReady}
      style={{ pointerEvents: "none" }}
    >
      <fog attach="fog" args={["#080b11", 8, 16]} />
      <SceneLights />
      <Choreography progress={progress} compact={compact} animate={animate}>
        <ValterAvatar url={avatarUrl} pointer={pointer} animate={animate} />
      </Choreography>
      {!lite && <FloatingTech tech={progress.tech} pointer={pointer} animate={animate} />}
      <SceneParticles count={lite ? 90 : 260} pointer={pointer} animate={animate} />
    </Canvas>
  );
}
