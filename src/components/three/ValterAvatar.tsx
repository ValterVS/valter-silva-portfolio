"use client";

import { Component, Suspense, lazy, type ReactNode } from "react";
import type { Pointer } from "./avatar-shared";

export type { Pointer };

export type AvatarAssets = {
  // Modelo 3D (public/models/valter-avatar.glb), usado só com avatarMode "glb"
  model: string | null;
  // Retrato da hero (public/models/valter-portrait.*), exibido como imagem comum
  portrait: string | null;
};

// O carregador de GLB (GLTFLoader, Draco, Meshopt) só é baixado quando existe um modelo em uso.
const ModelAvatar = lazy(() => import("./ModelAvatar"));

class AvatarErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const noop = () => undefined;

// Modelo GLB na cena. Se o arquivo falhar, a cena segue sem ele.
export function ValterAvatar({ model, pointer }: { model: string; pointer: Pointer }) {
  return (
    <AvatarErrorBoundary>
      <Suspense fallback={null}>
        <ModelAvatar url={model} pointer={pointer} animate onReady={noop} />
      </Suspense>
    </AvatarErrorBoundary>
  );
}
