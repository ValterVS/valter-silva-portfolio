"use client";

import { Float, Html, Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { layers, ringRadius, type Layer, type LayerId } from "./layers";

export type Quality = "full" | "lite";

type HeroSceneProps = {
  quality: Quality;
  animate: boolean;
  active: boolean;
  onReady: () => void;
};

const ACCENT = "#38bdf8";
const ACCENT_SOFT = "#7dd3fc";
const BLUE = "#3b82f6";
const SURFACE = "#0f1620";

function positionOn(layer: Layer, radius = ringRadius) {
  return new THREE.Vector3(Math.sin(layer.angle) * radius, layer.y, Math.cos(layer.angle) * radius);
}

// Pseudoaleatório com semente fixa: as partículas ficam sempre no mesmo lugar.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const geometries = {
  panel: new THREE.BoxGeometry(1.2, 0.78, 0.05),
  core: new THREE.OctahedronGeometry(0.2),
  cube: new THREE.BoxGeometry(0.3, 0.3, 0.3),
  disk: new THREE.CylinderGeometry(0.42, 0.42, 0.15, 48),
  cloudLarge: new THREE.IcosahedronGeometry(0.36, 1),
  cloudSmall: new THREE.IcosahedronGeometry(0.26, 1),
};

function Solid({
  geometry,
  edgeOpacity = 0.6,
  position,
}: {
  geometry: THREE.BufferGeometry;
  edgeOpacity?: number;
  position?: [number, number, number];
}) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 20), [geometry]);
  return (
    <group position={position}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={SURFACE} metalness={0.55} roughness={0.38} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={ACCENT} transparent opacity={edgeOpacity} />
      </lineSegments>
    </group>
  );
}

function ClientNode() {
  return (
    <group rotation={[0, 0.45, 0]}>
      <Solid geometry={geometries.panel} edgeOpacity={0.7} />
      <mesh position={[0, -0.05, 0.03]}>
        <planeGeometry args={[1.08, 0.56]} />
        <meshBasicMaterial color="#0a1a26" />
      </mesh>
      {[-0.5, -0.43, -0.36].map((x) => (
        <mesh key={x} position={[x, 0.31, 0.03]}>
          <circleGeometry args={[0.022, 12]} />
          <meshBasicMaterial color="#5f6b7d" />
        </mesh>
      ))}
      {[
        [0.7, 0.12],
        [0.48, 0.0],
        [0.6, -0.12],
        [0.32, -0.24],
      ].map(([width, y], index) => (
        <mesh key={index} position={[-0.46 + width / 2, y, 0.035]}>
          <planeGeometry args={[width, 0.045]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.75 - index * 0.14} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function ApiNode() {
  const core = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (core.current) core.current.rotation.y += delta * 0.8;
  });
  return (
    <group>
      <mesh>
        <torusGeometry args={[0.44, 0.022, 12, 72]} />
        <meshBasicMaterial color={ACCENT_SOFT} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.56, 0.006, 8, 72]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.35} />
      </mesh>
      <group ref={core}>
        <Solid geometry={geometries.core} edgeOpacity={0.9} />
      </group>
    </group>
  );
}

function ServicesNode() {
  const cubes = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    cubes.current?.children.forEach((child, index) => {
      const pulse = (Math.sin(clock.elapsedTime * 1.6 - index * 1.4) + 1) / 2;
      child.position.y = (index < 2 ? 0.17 : -0.17) + pulse * 0.04;
    });
  });
  return (
    <group ref={cubes} rotation={[0.25, 0.6, 0]}>
      <Solid geometry={geometries.cube} position={[-0.18, 0.17, 0]} />
      <Solid geometry={geometries.cube} position={[0.18, 0.17, 0]} edgeOpacity={0.9} />
      <Solid geometry={geometries.cube} position={[-0.18, -0.17, 0]} edgeOpacity={0.45} />
      <Solid geometry={geometries.cube} position={[0.18, -0.17, 0]} />
    </group>
  );
}

function DatabaseNode() {
  return (
    <group rotation={[0.2, 0, 0]}>
      {[0.22, 0, -0.22].map((y, index) => (
        <Solid key={y} geometry={geometries.disk} position={[0, y, 0]} edgeOpacity={0.85 - index * 0.2} />
      ))}
    </group>
  );
}

function CloudNode() {
  return (
    <group>
      <Solid geometry={geometries.cloudSmall} position={[-0.32, -0.06, 0]} edgeOpacity={0.4} />
      <Solid geometry={geometries.cloudLarge} position={[0.02, 0.08, 0]} edgeOpacity={0.55} />
      <Solid geometry={geometries.cloudSmall} position={[0.36, -0.08, 0.05]} edgeOpacity={0.4} />
    </group>
  );
}

const visuals: Record<LayerId, () => ReactNode> = {
  client: ClientNode,
  api: ApiNode,
  services: ServicesNode,
  database: DatabaseNode,
  cloud: CloudNode,
};

function Node({ layer, index }: { layer: Layer; index: number }) {
  const position = useMemo(() => positionOn(layer), [layer]);
  const Visual = visuals[layer.id];
  const onLeft = position.x < -0.1;

  return (
    <group position={position}>
      <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.4} floatingRange={[-0.05, 0.05]}>
        <Visual />
      </Float>
      <Html
        position={[onLeft ? -0.72 : 0.72, 0, 0]}
        zIndexRange={[20, 0]}
        className="pointer-events-none select-none"
        style={{ transform: `translate(${onLeft ? "-100%" : "0"}, -50%)` }}
      >
        <div className={`flex flex-col gap-1 whitespace-nowrap ${onLeft ? "items-end" : "items-start"}`}>
          <span className="font-mono text-[9.5px] tracking-[0.18em] text-faint uppercase">
            {String(index + 1).padStart(2, "0")} · {layer.label}
          </span>
          <span className="rounded-md border border-line bg-surface/80 px-1.5 py-0.5 font-mono text-[11px] text-accent-soft backdrop-blur-sm">
            {layer.tech}
          </span>
        </div>
      </Html>
    </group>
  );
}

function Structure() {
  const rings = useMemo(
    () =>
      layers.map((layer) =>
        Array.from({ length: 73 }, (_, step) => {
          const angle = (step / 72) * Math.PI * 2;
          return new THREE.Vector3(Math.sin(angle) * ringRadius, layer.y, Math.cos(angle) * ringRadius);
        }),
      ),
    [],
  );

  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.012, 0.012, 7.2, 8]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.4} />
      </mesh>
      {rings.map((points, index) => (
        <Line key={index} points={points} color="#94a3b8" transparent opacity={0.1} lineWidth={1} />
      ))}
      {layers.map((layer) => (
        <Line
          key={layer.id}
          points={[new THREE.Vector3(0, layer.y, 0), positionOn(layer)]}
          color={ACCENT}
          transparent
          opacity={0.25}
          lineWidth={1}
        />
      ))}
    </group>
  );
}

// Pacotes de dados: requisições descem pela trilha externa e respostas sobem pela interna.
function Packets({ count }: { count: number }) {
  const requests = useRef<THREE.InstancedMesh>(null);
  const responses = useRef<THREE.InstancedMesh>(null);
  const scratch = useRef({ object: new THREE.Object3D(), point: new THREE.Vector3() });

  const lanes = useMemo(() => {
    const outer = new THREE.CatmullRomCurve3(layers.map((layer) => positionOn(layer)));
    const inner = new THREE.CatmullRomCurve3(layers.map((layer) => positionOn(layer, ringRadius * 0.62)).reverse());
    return [outer, inner] as const;
  }, []);

  const paths = useMemo(() => lanes.map((curve) => curve.getPoints(160)), [lanes]);

  useFrame(({ clock }) => {
    const { object, point } = scratch.current;
    [requests.current, responses.current].forEach((mesh, lane) => {
      if (!mesh) return;
      for (let i = 0; i < count; i++) {
        const progress = (i / count + clock.elapsedTime * (lane === 0 ? 0.06 : 0.045)) % 1;
        lanes[lane].getPointAt(progress, point);
        object.position.copy(point);
        object.scale.setScalar(0.35 + Math.sin(progress * Math.PI) * 0.65);
        object.updateMatrix();
        mesh.setMatrixAt(i, object.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group>
      <Line points={paths[0]} color={ACCENT} transparent opacity={0.4} lineWidth={1.2} />
      <Line
        points={paths[1]}
        color={BLUE}
        transparent
        opacity={0.35}
        lineWidth={1}
        dashed
        dashSize={0.08}
        gapSize={0.08}
      />
      <instancedMesh ref={requests} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={ACCENT_SOFT} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={responses} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[0.034, 10, 10]} />
        <meshBasicMaterial color="#93c5fd" toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Dust({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const random = seeded(7);
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      values[i * 3] = (random() - 0.5) * 11;
      values[i * 3 + 1] = (random() - 0.5) * 8;
      values[i * 3 + 2] = (random() - 0.7) * 7;
    }
    return values;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#94a3b8" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Rig({ animate, children }: { animate: boolean; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const compact = useThree((state) => state.size.height < 420);

  useEffect(() => {
    if (!animate) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [animate]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const time = animate ? clock.elapsedTime : 0;
    const targetY = Math.sin(time * 0.16) * 0.32 + pointer.current.x * 0.22;
    const targetX = 0.07 + pointer.current.y * 0.05;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 2.2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 2.2, delta);
  });

  return (
    <group ref={group} rotation={[0.07, 0, 0]} scale={compact ? 1.12 : 1}>
      {children}
    </group>
  );
}

// Configuração da cena 3D
export default function HeroScene({ quality, animate, active, onReady }: HeroSceneProps) {
  const lite = quality === "lite";

  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0.2, 11.5], fov: 38 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: lite ? "low-power" : "high-performance" }}
      frameloop={!active ? "never" : animate ? "always" : "demand"}
      onCreated={onReady}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 6]} intensity={1.4} />
      <pointLight position={[0, 0.5, 4]} intensity={16} distance={12} color={ACCENT} />
      <pointLight position={[-5, 3, -4]} intensity={12} distance={14} color={BLUE} />

      <Rig animate={animate}>
        <Structure />
        {layers.map((layer, index) => (
          <Node key={layer.id} layer={layer} index={index} />
        ))}
        <Packets count={lite ? 8 : 16} />
      </Rig>
      <Dust count={lite ? 140 : 420} />
    </Canvas>
  );
}
