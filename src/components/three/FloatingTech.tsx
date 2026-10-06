"use client";

import { Float, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Pointer } from "./ValterAvatar";

// Nós flutuantes que lembram uma arquitetura: request → api → service → database.
const nodes = [
  { shape: "octahedron", position: [-2.4, 1.1, -1.2], size: 0.16, color: "#d6a640" },
  { shape: "ring", position: [-1.7, -0.4, 0.9], size: 0.2, color: "#4f7cff" },
  { shape: "box", position: [2.2, 0.7, -0.6], size: 0.17, color: "#d6a640" },
  { shape: "disk", position: [2.6, -0.9, 0.6], size: 0.18, color: "#4f7cff" },
  { shape: "icosahedron", position: [-2.9, -1.4, -2.2], size: 0.22, color: "#7c6cff" },
  { shape: "box", position: [3.1, 1.8, -2.4], size: 0.13, color: "#4f7cff" },
] as const;

const route = [nodes[0].position, nodes[1].position, nodes[2].position, nodes[3].position].map(
  (point) => new THREE.Vector3(...point),
);

function Token({ shape, size, color }: { shape: string; size: number; color: string }) {
  const geometry = useMemo(() => {
    switch (shape) {
      case "octahedron":
        return new THREE.OctahedronGeometry(size);
      case "ring":
        return new THREE.TorusGeometry(size, size * 0.18, 10, 40);
      case "disk":
        return new THREE.CylinderGeometry(size, size, size * 0.6, 32);
      case "icosahedron":
        return new THREE.IcosahedronGeometry(size, 0);
      default:
        return new THREE.BoxGeometry(size, size, size);
    }
  }, [shape, size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 25), [geometry]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#121824" metalness={0.5} roughness={0.35} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} transparent opacity={0.9} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

type FloatingTechProps = {
  tech: MotionValue<number>;
  pointer: Pointer;
  animate: boolean;
};

export function FloatingTech({ tech, pointer, animate }: FloatingTechProps) {
  const group = useRef<THREE.Group>(null);
  const packet = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(route), []);
  const path = useMemo(() => curve.getPoints(80), [curve]);

  useFrame(({ clock }, delta) => {
    if (group.current) {
      // Durante a seção de stack os nós sobem junto com as palavras.
      const rise = tech.get() * 3.2;
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, pointer.x.get() * 0.25, 2.5, delta);
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        rise - pointer.y.get() * 0.15,
        7,
        delta,
      );
    }
    if (packet.current && animate) {
      packet.current.position.copy(curve.getPointAt((clock.elapsedTime * 0.12) % 1));
    }
  });

  return (
    <group ref={group}>
      {nodes.map((node, index) => (
        <group key={index} position={[...node.position]}>
          <Float speed={animate ? 1.2 + index * 0.15 : 0} rotationIntensity={0.6} floatIntensity={0.6}>
            <Token shape={node.shape} size={node.size} color={node.color} />
          </Float>
        </group>
      ))}
      <Line points={path} color="#d6a640" transparent opacity={0.16} lineWidth={1} dashed dashSize={0.1} gapSize={0.12} />
      <mesh ref={packet} position={route[0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#ecc97a" toneMapped={false} />
      </mesh>
    </group>
  );
}
