import { existsSync } from "node:fs";
import path from "node:path";

// Coloque o modelo definitivo em public/models/valter-avatar.glb. Sem ele, a cena usa o busto abstrato.
const avatarPath = "/models/valter-avatar.glb";

export function getAvatarUrl() {
  return existsSync(path.join(process.cwd(), "public", avatarPath)) ? avatarPath : null;
}
