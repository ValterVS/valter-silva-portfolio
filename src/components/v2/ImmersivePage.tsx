"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import { useCompact, useFinePointer, useQuality, useReducedMotion } from "@/lib/media";
import type { AvatarAssets } from "@/components/three/ValterAvatar";
import type { ImmersiveContent } from "./content";
import { Corners } from "./Corners";
import { AboutSection } from "./AboutSection";
import { ContactSection, FooterV2 } from "./ContactSection";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { HeroSection } from "./HeroSection";
import { Loader } from "./Loader";
import { StackSection, TechLayer } from "./TechFlow";
import { V2Header } from "./V2Header";
import { WorkSection } from "./WorkSection";

const PortfolioScene = dynamic(() => import("@/components/three/PortfolioScene"), { ssr: false });

type ImmersivePageProps = {
  locale: Locale;
  ui: ImmersiveDictionary;
  content: ImmersiveContent;
  avatar: AvatarAssets;
  resumeUrl: string | null;
  classicHref: string;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function ImmersivePage({ locale, ui, content, avatar, resumeUrl, classicHref }: ImmersivePageProps) {
  const quality = useQuality();
  const reduced = useReducedMotion();
  const compact = useCompact();
  const finePointer = useFinePointer();
  const [ready, setReady] = useState(false);
  const [stageActive, setStageActive] = useState(true);

  const heroRef = useRef<HTMLElement>(null);
  const techRef = useRef<HTMLElement>(null);
  const stackListRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const hero = useScroll({ target: heroRef, offset: ["start start", "end end"] }).scrollYProgress;
  const tech = useScroll({ target: techRef, offset: ["start end", "end start"] }).scrollYProgress;
  const leaving = useScroll({ target: stackListRef, offset: ["start end", "start 0.45"] }).scrollYProgress;
  const contact = useScroll({ target: contactRef, offset: ["start end", "start 0.25"] }).scrollYProgress;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const pointerY = useSpring(rawY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (reduced || !finePointer) return;
    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, finePointer, rawX, rawY]);

  // O palco 3D some quando a lista de tecnologias chega e volta no contato.
  const stageOpacity = useTransform(() => {
    const heroValue = hero.get();
    const back = compact ? Math.max(1 - heroValue * 0.7, clamp01(tech.get() * 4)) : 1;
    const visible = reduced ? 1 - heroValue : Math.min(back, 1 - leaving.get());
    return Math.max(visible, contact.get());
  });

  useMotionValueEvent(stageOpacity, "change", (value) => setStageActive(value > 0.01));

  const backdropX = useTransform(pointerX, (value) => value * -14);
  const backdropY = useTransform(pointerY, (value) => value * -10);

  const showScene = quality === "full" || quality === "lite";
  const showTechFlow = !reduced;

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-ink text-fg">
      <motion.div aria-hidden="true" className="pointer-events-none fixed -inset-8 z-0" style={{ x: backdropX, y: backdropY }}>
        <div className="absolute top-[18%] left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-gold/[0.07] blur-[140px]" />
        <div className="absolute -top-40 -right-40 size-[40rem] rounded-full bg-electric/[0.09] blur-[150px]" />
        <div className="absolute -bottom-48 -left-40 size-[36rem] rounded-full bg-[#7c6cff]/[0.06] blur-[150px]" />
      </motion.div>

      {showTechFlow && <TechLayer depth="back" progress={tech} content={content} />}

      {showScene && (
        <motion.div aria-hidden="true" className="pointer-events-none fixed inset-0 z-10" style={{ opacity: stageOpacity }}>
          <PortfolioScene
            avatar={avatar}
            progress={{ hero, tech, contact }}
            pointer={{ x: pointerX, y: pointerY }}
            quality={quality}
            compact={compact}
            animate={!reduced}
            active={stageActive}
            onReady={() => setReady(true)}
          />
        </motion.div>
      )}

      {showTechFlow && <TechLayer depth="front" progress={tech} content={content} />}

      <V2Header locale={locale} ui={ui} resumeUrl={resumeUrl} links={content.links} />
      <Corners ui={ui} resumeUrl={resumeUrl} links={content.links} />
      <Loader ui={ui} done={ready || quality === "none" || reduced} />

      <main id="content" className="relative z-30">
        <HeroSection sectionRef={heroRef} progress={hero} ui={ui} content={content} />
        <AboutSection ui={ui} content={content} />
        <StackSection sectionRef={techRef} listRef={stackListRef} ui={ui} content={content} flow={showTechFlow} />
        <ExperienceSection ui={ui} content={content} />
        <WorkSection ui={ui} content={content} />
        <EducationSection ui={ui} content={content} />
        <ContactSection sectionRef={contactRef} ui={ui} content={content} resumeUrl={resumeUrl} />
      </main>
      <FooterV2 ui={ui} content={content} classicHref={classicHref} />
    </div>
  );
}
