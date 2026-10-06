import { existsSync } from "node:fs";
import path from "node:path";
import type { AvatarAssets } from "@/components/three/ValterAvatar";

// "portrait": usa o retrato em relevo e nunca busca o GLB.
// "glb": usa public/models/valter-avatar.glb quando o arquivo existir (com o retrato como imagem inicial).
export const avatarMode: "portrait" | "glb" = "portrait";

const modelFile = "/models/valter-avatar.glb";
const portraitFiles = ["/models/valter-portrait.webp", "/models/valter-portrait.jpg", "/models/valter-portrait.png"];

const exists = (file: string) => existsSync(path.join(process.cwd(), "public", file));

export function getAvatarAssets(): AvatarAssets {
  return {
    model: avatarMode === "glb" && exists(modelFile) ? modelFile : null,
    portrait: portraitFiles.find(exists) ?? null,
  };
}
