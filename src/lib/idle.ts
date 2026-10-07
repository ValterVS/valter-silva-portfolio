import { useEffect, useState } from "react";

// Quando liberar algo pesado (a cena 3D) sem disputar com o primeiro carregamento:
// "idle": depois do load, assim que o navegador fica ocioso;
// "interaction": depois do load, no primeiro toque/scroll/tecla, ou após INTERACTION_TIMEOUT sem interação.
// null: ainda não se sabe (ex.: antes de detectar o aparelho), nada é agendado.
export type ReleaseMode = "idle" | "interaction" | null;

const INTERACTION_TIMEOUT = 3500;
const interactionEvents = ["pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;

export function useAfterLoad(mode: ReleaseMode) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mode) return;
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const release = () => setLoaded(true);
    const stopListening = () => {
      for (const name of interactionEvents) window.removeEventListener(name, onInteraction);
    };
    function onInteraction() {
      stopListening();
      clearTimeout(timer);
      release();
    }

    const schedule = () => {
      if (mode === "interaction") {
        for (const name of interactionEvents) window.addEventListener(name, onInteraction, { passive: true, once: true });
        timer = setTimeout(onInteraction, INTERACTION_TIMEOUT);
      } else if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(release, { timeout: 1200 });
      } else {
        timer = setTimeout(release, 150);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      stopListening();
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, [mode]);

  return loaded;
}
