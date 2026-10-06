"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

export type Pointer = { x: MotionValue<number>; y: MotionValue<number> };

type AvatarProps = {
  url: string | null;
  pointer: Pointer;
  animate: boolean;
};

// Altura e topo do avatar na cena. O GLB é escalado para caber nesse espaço.
const AVATAR_HEIGHT = 2.9;
const AVATAR_TOP = 1.12;

const GOLD = "#d6a640";

class AvatarErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function ValterAvatar({ url, pointer, animate }: AvatarProps) {
  const fallback = <AbstractBust pointer={pointer} animate={animate} />;
  if (!url) return fallback;

  return (
    <AvatarErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <ModelAvatar url={url} pointer={pointer} animate={animate} />
      </Suspense>
    </AvatarErrorBoundary>
  );
}

function ModelAvatar({ url, pointer, animate }: AvatarProps & { url: string }) {
  const { scene, animations } = useGLTF(url);
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Object3D | null>(null);
  const { actions, names } = useAnimations(animations, root);
  const idle = names.find((name) => /idle/i.test(name));

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = AVATAR_HEIGHT / (size.y || 1);
    return {
      scale,
      position: [-center.x * scale, AVATAR_TOP - box.max.y * scale, -center.z * scale] as const,
    };
  }, [scene]);

  useEffect(() => {
    let found: THREE.Object3D | null = null;
    scene.traverse((object) => {
      if (!found && (object as THREE.Bone).isBone && /head/i.test(object.name) && !/end|top|nub/i.test(object.name)) {
        found = object;
      }
    });
    head.current = found;
  }, [scene]);

  useEffect(() => {
    if (!idle || !animate) return;
    const action = actions[idle];
    action?.reset().fadeIn(0.5).play();
    return () => {
      action?.fadeOut(0.3);
    };
  }, [actions, idle, animate]);

  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    const time = animate ? clock.elapsedTime : 0;
    const lookX = pointer.x.get();
    const lookY = pointer.y.get();

    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, lookX * 0.16, 3, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, lookY * 0.04, 3, delta);

    // Sem clip de animação, a cabeça ganha só um movimento procedural leve.
    if (!idle && head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, lookX * 0.22, 3, delta);
      head.current.rotation.x = THREE.MathUtils.damp(
        head.current.rotation.x,
        lookY * 0.1 + Math.sin(time * 0.6) * 0.015,
        3,
        delta,
      );
    }
  });

  return (
    <group ref={root}>
      <group position={fit.position} scale={fit.scale}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// Busto abstrato usado enquanto o modelo definitivo não existe. Não tem rosto de propósito.
const bustProfile = [
  [0, -2.6],
  [0.86, -2.6],
  [0.9, -1.3],
  [0.93, -0.95],
  [0.92, -0.72],
  [0.86, -0.56],
  [0.7, -0.44],
  [0.5, -0.36],
  [0.32, -0.26],
  [0.24, -0.16],
  [0, -0.12],
].map(([radius, y]) => new THREE.Vector2(radius, y));

const skin = {
  color: "#232b3a",
  metalness: 0.28,
  roughness: 0.38,
  clearcoat: 0.9,
  clearcoatRoughness: 0.3,
};

// Esfera afinada na parte de baixo: dá forma de cabeça sem desenhar traços do rosto.
function createHead() {
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i);
    const taper = y < 0 ? 1 - 0.22 * Math.abs(y) ** 1.5 : 1;
    position.setXYZ(i, position.getX(i) * taper, y, position.getZ(i) * taper + (y < 0 ? 0.06 * -y : 0));
  }
  geometry.computeVertexNormals();
  return geometry;
}

function createMonogram() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = GOLD;
    context.font = "600 84px system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("VS", 128, 68);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function AbstractBust({ pointer, animate }: { pointer: Pointer; animate: boolean }) {
  const body = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const headGroup = useRef<THREE.Group>(null);
  const visor = useRef<THREE.MeshBasicMaterial>(null);

  const parts = useMemo(
    () => ({
      torso: new THREE.LatheGeometry(bustProfile, 64),
      mesh: new THREE.WireframeGeometry(new THREE.LatheGeometry(bustProfile, 18)),
      head: createHead(),
      monogram: createMonogram(),
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    const time = animate ? clock.elapsedTime : 0;
    const lookX = pointer.x.get();
    const lookY = pointer.y.get();

    if (body.current) {
      body.current.rotation.y = THREE.MathUtils.damp(
        body.current.rotation.y,
        lookX * 0.12 + Math.sin(time * 0.35) * 0.04,
        2.5,
        delta,
      );
    }
    if (torso.current) torso.current.scale.y = 1 + Math.sin(time * 1.2) * 0.008;
    if (headGroup.current) {
      headGroup.current.rotation.y = THREE.MathUtils.damp(headGroup.current.rotation.y, lookX * 0.22, 3, delta);
      headGroup.current.rotation.x = THREE.MathUtils.damp(
        headGroup.current.rotation.x,
        lookY * 0.12 + Math.sin(time * 0.7) * 0.02,
        3,
        delta,
      );
      headGroup.current.position.y = 0.04 + Math.sin(time * 1.2) * 0.006;
    }
    if (visor.current) visor.current.opacity = 0.85 + Math.sin(time * 1.6) * 0.1;
  });

  return (
    <group ref={body}>
      <group ref={torso}>
        <group scale={[1.45, 1, 0.62]}>
          <mesh geometry={parts.torso}>
            <meshPhysicalMaterial {...skin} />
          </mesh>
          <lineSegments geometry={parts.mesh}>
            <lineBasicMaterial color={GOLD} transparent opacity={0.07} />
          </lineSegments>
        </group>
        <mesh position={[0, -0.88, 0.585]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshBasicMaterial map={parts.monogram} transparent opacity={0.85} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.012, 8, 48]} />
          <meshBasicMaterial color={GOLD} toneMapped={false} />
        </mesh>
      </group>

      <group ref={headGroup} position={[0, 0.04, 0]}>
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.17, 0.21, 0.34, 32]} />
          <meshPhysicalMaterial color="#1d2431" metalness={0.3} roughness={0.42} clearcoat={0.6} />
        </mesh>
        <mesh geometry={parts.head} position={[0, 0.6, 0]} scale={[0.4, 0.5, 0.45]}>
          <meshPhysicalMaterial {...skin} />
        </mesh>
        <group position={[0, 0.63, 0.01]} rotation={[0, -0.05 * Math.PI, 0]} scale={[0.415, 0.5, 0.465]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1, 0.06, 10, 64, Math.PI * 0.9]} />
            <meshBasicMaterial ref={visor} color={GOLD} transparent toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
