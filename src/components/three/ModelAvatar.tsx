"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { AVATAR_HEIGHT, AVATAR_TOP, LOOK_PITCH, LOOK_YAW, useFirstFrame, type PartProps } from "./avatar-shared";

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

export default function ModelAvatar({ url, pointer, animate, onReady }: PartProps & { url: string }) {
  const { scene, animations } = useGLTF(url);
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Object3D | null>(null);
  const faces = useRef<FaceTargets[]>([]);
  const blink = useRef({ start: -1, next: 2.5 });
  const { actions, names } = useAnimations(animations, root);
  const idle = names.find((name) => /idle/i.test(name));
  useFirstFrame(onReady);

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
