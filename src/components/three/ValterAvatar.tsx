"use client";

import { useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

export type Pointer = { x: MotionValue<number>; y: MotionValue<number> };

export type AvatarAssets = {
  // Modelo 3D definitivo (public/models/valter-avatar.glb)
  model: string | null;
  // Retrato usado em relevo 2.5D enquanto o modelo não existe (public/models/valter-portrait.*)
  portrait: string | null;
};

type AvatarProps = {
  assets: AvatarAssets;
  pointer: Pointer;
  animate: boolean;
};

type PartProps = { pointer: Pointer; animate: boolean };

// Altura e topo do avatar na cena. O GLB é escalado para caber nesse espaço.
const AVATAR_HEIGHT = 2.9;
const AVATAR_TOP = 1.12;

// Rotação máxima em resposta ao cursor (radianos): alguns graus, nada mais.
const LOOK_YAW = 0.12;
const LOOK_PITCH = 0.05;

class AvatarErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// Ordem de preferência: modelo GLB → retrato em relevo → busto estilizado.
export function ValterAvatar({ assets, pointer, animate }: AvatarProps) {
  const bust = <StylizedBust pointer={pointer} animate={animate} />;
  const portrait = assets.portrait ? (
    <AvatarErrorBoundary fallback={bust}>
      <Suspense fallback={bust}>
        <PortraitRelief url={assets.portrait} pointer={pointer} animate={animate} />
      </Suspense>
    </AvatarErrorBoundary>
  ) : (
    bust
  );

  if (!assets.model) return portrait;

  return (
    <AvatarErrorBoundary fallback={portrait}>
      <Suspense fallback={portrait}>
        <ModelAvatar url={assets.model} pointer={pointer} animate={animate} />
      </Suspense>
    </AvatarErrorBoundary>
  );
}

type FaceTargets = { mesh: THREE.Mesh; blink: number[]; smile: number[] };

// Piscada (0 a 1) e um sorriso bem discreto, aplicados só nos morph targets que o modelo tiver.
function applyExpression(targets: FaceTargets[], closed: number) {
  for (const { mesh, blink, smile } of targets) {
    const influences = mesh.morphTargetInfluences;
    if (!influences) continue;
    for (const index of blink) influences[index] = closed;
    for (const index of smile) influences[index] = 0.12;
  }
}

function ModelAvatar({ url, pointer, animate }: PartProps & { url: string }) {
  const { scene, animations } = useGLTF(url);
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Object3D | null>(null);
  const faces = useRef<FaceTargets[]>([]);
  const blink = useRef({ start: -1, next: 2.5 });
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

  // Procura o que o modelo oferece, sem depender de nomes fixos: osso da cabeça e morph targets de piscar/sorrir.
  useEffect(() => {
    let found: THREE.Object3D | null = null;
    const targets: FaceTargets[] = [];
    scene.traverse((object) => {
      if (!found && (object as THREE.Bone).isBone && /head/i.test(object.name) && !/end|top|nub/i.test(object.name)) {
        found = object;
      }
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh || !mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
      const pick = (pattern: RegExp) =>
        Object.entries(mesh.morphTargetDictionary ?? {})
          .filter(([name]) => pattern.test(name))
          .map(([, index]) => index);
      const entry = { mesh, blink: pick(/blink/i), smile: pick(/smile/i) };
      if (entry.blink.length > 0 || entry.smile.length > 0) targets.push(entry);
    });
    head.current = found;
    faces.current = targets;
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

    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, lookX * LOOK_YAW, 3, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, lookY * LOOK_PITCH, 3, delta);

    // Sem clip de animação, a cabeça ganha só um movimento procedural leve.
    if (!idle && head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, lookX * LOOK_YAW, 3, delta);
      head.current.rotation.x = THREE.MathUtils.damp(
        head.current.rotation.x,
        lookY * LOOK_PITCH + Math.sin(time * 0.6) * 0.012,
        3,
        delta,
      );
    }

    if (faces.current.length === 0) return;
    if (animate && time > blink.current.next) {
      blink.current.start = time;
      blink.current.next = time + 2.8 + Math.random() * 3.5;
    }
    const sinceBlink = time - blink.current.start;
    const closed = sinceBlink >= 0 && sinceBlink < 0.16 ? Math.sin((sinceBlink / 0.16) * Math.PI) : 0;
    applyExpression(faces.current, closed);
  });

  return (
    <group ref={root}>
      <group position={fit.position} scale={fit.scale}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// Retrato em relevo: a imagem ganha profundidade aproximada (cabeça e tronco) e reage ao cursor.
// Não é um modelo 3D do rosto; funciona bem só para rotações pequenas.
const PORTRAIT_HEIGHT = 3.9;
// Pontos de referência do retrato, em proporção da imagem (0 a 1). Ajuste se trocar a imagem.
const portraitShape = {
  hairTop: 0.09,
  head: { u: 0.505, v: 0.385, rx: 0.27, ry: 0.31, depth: 0.55 },
  nose: { u: 0.465, v: 0.4, size: 0.045, depth: 0.12 },
  torso: { u: 0.5, v: 1.05, rx: 0.64, ry: 0.5, depth: 0.42 },
};

function dome(u: number, v: number, shape: { u: number; v: number; rx: number; ry: number; depth: number }) {
  const r = ((u - shape.u) / shape.rx) ** 2 + ((v - shape.v) / shape.ry) ** 2;
  return r < 1 ? Math.sqrt(1 - r) * shape.depth : 0;
}

function createRelief(aspect: number) {
  const width = PORTRAIT_HEIGHT * aspect;
  const geometry = new THREE.PlaneGeometry(width, PORTRAIT_HEIGHT, 140, 175);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const { head, nose, torso } = portraitShape;
  for (let i = 0; i < position.count; i++) {
    const u = uv.getX(i);
    const v = 1 - uv.getY(i);
    const bump = Math.exp(-(((u - nose.u) ** 2 + (v - nose.v) ** 2) / (2 * nose.size ** 2))) * nose.depth;
    position.setZ(i, Math.max(dome(u, v, head) + bump, dome(u, v, torso)));
  }
  geometry.computeVertexNormals();
  return geometry;
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

// Máscara que dissolve as bordas do retrato no fundo do site (lida pelo canal verde do alphaMap).
function createEdgeMask() {
  const width = 128;
  const height = 160;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (context) {
    const pixels = context.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const u = x / (width - 1);
        const v = y / (height - 1);
        const sides = 1 - smoothstep(0.3, 0.44, Math.abs(u - 0.5));
        const top = smoothstep(0.02, 0.08, v);
        const bottom = 1 - smoothstep(0.8, 0.98, v);
        const value = Math.round(sides * top * bottom * 255);
        pixels.data.set([value, value, value, 255], (y * width + x) * 4);
      }
    }
    context.putImageData(pixels, 0, 0);
  }
  return new THREE.CanvasTexture(canvas);
}

function PortraitRelief({ url, pointer, animate }: PartProps & { url: string }) {
  const root = useRef<THREE.Group>(null);
  const texture = useTexture(url, (loaded) => {
    loaded.colorSpace = THREE.SRGBColorSpace;
    loaded.anisotropy = 4;
  });
  const image = texture.image as { width: number; height: number };
  const aspect = image.width / image.height;
  const geometry = useMemo(() => createRelief(aspect), [aspect]);
  const mask = useMemo(() => createEdgeMask(), []);
  const centerY = AVATAR_TOP + portraitShape.hairTop * PORTRAIT_HEIGHT - PORTRAIT_HEIGHT / 2;

  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    const time = animate ? clock.elapsedTime : 0;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, pointer.x.get() * LOOK_YAW * 0.8, 3, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, pointer.y.get() * LOOK_PITCH, 3, delta);
    root.current.position.y = Math.sin(time * 1.1) * 0.008;
    root.current.scale.y = 1 + Math.sin(time * 1.1) * 0.003;
  });

  return (
    <group ref={root}>
      <mesh geometry={geometry} position={[0, centerY, 0]}>
        <meshBasicMaterial map={texture} alphaMap={mask} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

// Busto abstrato usado só em desenvolvimento: silhueta escura sem rosto, com cabelo, barba e camiseta sugeridos.
const torsoProfile = [
  [0, -2.6],
  [0.88, -2.6],
  [0.93, -1.3],
  [0.97, -0.95],
  [0.96, -0.72],
  [0.9, -0.56],
  [0.74, -0.44],
  [0.52, -0.36],
  [0.34, -0.27],
  [0.27, -0.17],
  [0, -0.13],
].map(([radius, y]) => new THREE.Vector2(radius, y));

const clay = { color: "#2a3140", roughness: 0.38, metalness: 0.25, clearcoat: 0.9, clearcoatRoughness: 0.3 };
const fabric = { color: "#0e1015", roughness: 0.92, metalness: 0, sheen: 0.6, sheenRoughness: 0.8, sheenColor: "#2d3546" };
const hair = { color: "#0d0f14", roughness: 0.75, metalness: 0.05 };
const beard = { color: "#11141b", roughness: 0.95, metalness: 0 };

function createHead() {
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i);
    const taper = y < 0 ? 1 - 0.12 * Math.abs(y) ** 1.6 : 1;
    position.setXYZ(i, position.getX(i) * taper, y, position.getZ(i) * taper + (y < 0 ? 0.05 * -y : 0));
  }
  geometry.computeVertexNormals();
  return geometry;
}

function StylizedBust({ pointer, animate }: PartProps) {
  const body = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const headGroup = useRef<THREE.Group>(null);

  const parts = useMemo(
    () => ({
      torso: new THREE.LatheGeometry(torsoProfile, 64),
      head: createHead(),
      hair: new THREE.SphereGeometry(1, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.42),
      beard: new THREE.SphereGeometry(1, 48, 24, Math.PI * 0.05, Math.PI * 0.9, Math.PI * 0.7, Math.PI * 0.3),
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
        lookX * LOOK_YAW * 0.6 + Math.sin(time * 0.35) * 0.03,
        2.5,
        delta,
      );
    }
    if (torso.current) torso.current.scale.y = 1 + Math.sin(time * 1.2) * 0.006;
    if (headGroup.current) {
      headGroup.current.rotation.y = THREE.MathUtils.damp(headGroup.current.rotation.y, lookX * LOOK_YAW, 3, delta);
      headGroup.current.rotation.x = THREE.MathUtils.damp(
        headGroup.current.rotation.x,
        lookY * LOOK_PITCH + Math.sin(time * 0.7) * 0.012,
        3,
        delta,
      );
      headGroup.current.position.y = 0.04 + Math.sin(time * 1.2) * 0.005;
    }
  });

  return (
    <group ref={body}>
      <group ref={torso}>
        <mesh geometry={parts.torso} scale={[1.5, 1, 0.66]}>
          <meshPhysicalMaterial {...fabric} />
        </mesh>
        <mesh position={[0, -0.16, 0.01]} rotation={[Math.PI / 2, 0, 0]} scale={[1.12, 0.86, 1]}>
          <torusGeometry args={[0.29, 0.035, 12, 48]} />
          <meshPhysicalMaterial {...fabric} color="#16191f" />
        </mesh>
      </group>

      <group ref={headGroup} position={[0, 0.04, 0]}>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.21, 0.25, 0.28, 32]} />
          <meshPhysicalMaterial {...clay} />
        </mesh>
        <group position={[0, 0.5, 0]}>
          <mesh geometry={parts.head} scale={[0.46, 0.53, 0.49]}>
            <meshPhysicalMaterial {...clay} />
          </mesh>
          <mesh geometry={parts.beard} scale={[0.475, 0.545, 0.51]}>
            <meshStandardMaterial {...beard} side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={parts.hair} position={[0, 0.03, -0.015]} rotation={[-0.18, 0, 0.1]} scale={[0.49, 0.53, 0.52]}>
            <meshStandardMaterial {...hair} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
