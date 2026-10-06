"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Pointer } from "./ValterAvatar";

const HEIGHT = 10;

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Partículas subindo devagar, como um fluxo de dados. Duas cópias empilhadas fazem o loop sem emenda.
export function SceneParticles({ count, pointer, animate }: { count: number; pointer: Pointer; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const stream = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const random = seeded(11);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const gold = new THREE.Color("#d6a640");
    const blue = new THREE.Color("#4f7cff");
    const grey = new THREE.Color("#8b93a7");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (random() - 0.5) * 12;
      positions[i * 3 + 1] = (random() - 0.5) * HEIGHT;
      positions[i * 3 + 2] = -1 - random() * 6;
      const roll = random();
      const color = roll < 0.18 ? gold : roll < 0.45 ? blue : grey;
      colors.set([color.r, color.g, color.b], i * 3);
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return buffer;
  }, [count]);

  useFrame(({ clock }, delta) => {
    if (stream.current && animate) stream.current.position.y = (clock.elapsedTime * 0.12) % HEIGHT;
    if (group.current) {
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, pointer.x.get() * 0.1, 2, delta);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, -pointer.y.get() * 0.06, 2, delta);
    }
  });

  return (
    <group ref={group}>
      <group ref={stream}>
        {[-HEIGHT, 0].map((offset) => (
          <points key={offset} geometry={geometry} position={[0, offset, 0]}>
            <pointsMaterial size={0.028} vertexColors transparent opacity={0.55} sizeAttenuation depthWrite={false} />
          </points>
        ))}
      </group>
    </group>
  );
}
