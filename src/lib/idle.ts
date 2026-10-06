import { useEffect, useState } from "react";

// Vira true quando a página terminou de carregar e o navegador ficou ocioso.
// Usado para baixar o 3D sem disputar banda e CPU com o primeiro carregamento.
export function useAfterLoad() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const release = () => setLoaded(true);
    const schedule = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(release, { timeout: 1200 });
      else timer = setTimeout(release, 150);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);

  return loaded;
}
