import { existsSync } from "node:fs";
import path from "node:path";
import type { AvatarAssets } from "@/components/three/ValterAvatar";

// Arquivos do avatar em public/models. Trocar o asset não exige mudar código.
const modelFile = "/models/valter-avatar.glb";
const portraitFiles = ["/models/valter-portrait.webp", "/models/valter-portrait.jpg", "/models/valter-portrait.png"];

const exists = (file: string) => existsSync(path.join(process.cwd(), "public", file));

export function getAvatarAssets(): AvatarAssets {
  return {
    model: exists(modelFile) ? modelFile : null,
    portrait: portraitFiles.find(exists) ?? null,
  };
}
