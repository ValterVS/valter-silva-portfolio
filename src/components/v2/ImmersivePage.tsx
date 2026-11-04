"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { Locale } from "@/i18n/config";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import { useAfterLoad } from "@/lib/idle";
import { useCompact, useFinePointer, useQuality, useReducedMotion } from "@/lib/media";
import { cx } from "@/lib/styles";
import type { AvatarAssets } from "@/components/three/ValterAvatar";
import type { ImmersiveContent } from "./content";
import type { FlowItem } from "./flow";
import { Corners } from "./Corners";
import { Portrait } from "./Portrait";
import { HeroSection, HeroStack, type HeroContent } from "./HeroSection";
import { TechLayer } from "./TechFlow";
import { V2Header } from "./V2Header";

// O 3D só é baixado depois que a página terminou de carregar.
const PortfolioScene = dynamic(() => import("@/components/three/PortfolioScene"), { ssr: false });

type ImmersivePageProps = {
  locale: Locale;
  ui: ImmersiveDictionary;
  avatar: AvatarAssets;
  resumeUrl: string | null;
  links: ImmersiveContent["links"];
  hero: HeroContent;
  flow: FlowItem[];
  children: ReactNode;
  footer: ReactNode;
};

function useSectionRef(id: string): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    ref.current = document.getElementById(id);
  }, [id]);
  return ref;
}

export function ImmersivePage({ locale, ui, avatar, resumeUrl, links, hero: heroContent, flow, children, footer }: ImmersivePageProps) {
  const quality = useQuality();
  const reduced = useReducedMotion();
  const compact = useCompact();
  const finePointer = useFinePointer();
  const [ready, setReady] = useState(false);
  const [stageActive, setStageActive] = useState(true);

  // Os refs precisam existir antes dos useScroll abaixo (efeitos rodam na ordem em que são declarados).
  const heroRef = useSectionRef("hero");
  const techRef = useSectionRef("stack-flow");
  const stackListRef = useSectionRef("stack-list");
  const contactRef = useSectionRef("contact");

  const hero = useScroll({ target: heroRef, offset: ["start start", "end end"] }).scrollYProgress;
  const tech = useScroll({ target: techRef, offset: ["start end", "end start"] }).scrollYProgress;
  const leaving = useScroll({ target: stackListRef, offset: ["start end", "start 60%"] }).scrollYProgress;
  const contact = useScroll({ target: contactRef, offset: ["start end", "start 45%"] }).scrollYProgress;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, { stiffness: 110, damping: 24 });
  const pointerY = useSpring(rawY, { stiffness: 110, damping: 24 });

  useEffect(() => {
    if (reduced || !finePointer) return;
    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, finePointer, rawX, rawY]);

  const portrait = !avatar.model ? avatar.portrait : null;
  // A cena 3D (partículas e nós flutuantes, ou o modelo GLB) é só enfeite de fundo: fica para desktop
  // com GPU, carregada quando o navegador está ocioso. No celular o conteúdo vem primeiro.
  const sceneAllowed = !reduced && (quality === "full" || (quality === "lite" && Boolean(avatar.model)));
  const loaded = useAfterLoad(!sceneAllowed ? null : quality === "lite" ? "interaction" : "idle");
  const showScene = sceneAllowed && loaded;

  // O fundo 3D some quando a lista de tecnologias chega e volta no contato.
  const stageOpacity = useTransform(() => Math.max(1 - leaving.get(), contact.get()));

  useMotionValueEvent(stageOpacity, "change", (value) => setStageActive(value > 0.01));

  const backdropX = useTransform(pointerX, (value) => value * -14);
  const backdropY = useTransform(pointerY, (value) => value * -10);

  return (
    <div className="relative min-h-svh overflow-x-clip bg-ink text-fg">
      <motion.div aria-hidden="true" className="pointer-events-none fixed -inset-8 z-0" style={{ x: backdropX, y: backdropY }}>
        <div className="absolute top-[18%] left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-gold/[0.07] blur-[140px]" />
        <div className="absolute -top-40 -right-40 size-[40rem] rounded-full bg-electric/[0.09] blur-[150px]" />
        <div className="absolute -bottom-48 -left-40 size-[36rem] rounded-full bg-[#7c6cff]/[0.06] blur-[150px]" />
      </motion.div>

      <HeroStack progress={hero} />
      {!reduced && <TechLayer depth="back" progress={tech} fade={leaving} items={flow} />}

      {showScene && (
        <motion.div aria-hidden="true" className="pointer-events-none fixed inset-0 z-10" style={{ opacity: stageOpacity }}>
          <div className={cx("absolute inset-0 transition-opacity duration-700", !ready && "opacity-0")}>
            <PortfolioScene
              avatar={avatar}
              progress={{ hero, tech, contact }}
              pointer={{ x: pointerX, y: pointerY }}
              quality={quality === "lite" ? "lite" : "full"}
              compact={compact}
              active={stageActive}
              onReady={() => setReady(true)}
            />
          </div>
        </motion.div>
      )}

      {portrait && (
        <Portrait
          src={portrait}
          alt={ui.hero.portraitAlt}
          hero={hero}
          tech={tech}
          contact={contact}
          pointer={{ x: pointerX, y: pointerY }}
          compact={compact}
        />
      )}

      {!reduced && <TechLayer depth="front" progress={tech} fade={leaving} items={flow} />}

      <V2Header locale={locale} ui={ui} resumeUrl={resumeUrl} links={links} />
      <Corners ui={ui} resumeUrl={resumeUrl} links={links} />

      <main id="content" className="relative z-30">
        <HeroSection progress={hero} ui={ui} content={heroContent} resumeUrl={resumeUrl} />
        {children}
      </main>
      {footer}
    </div>
  );
}
