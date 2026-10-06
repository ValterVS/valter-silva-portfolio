import { Gamepad2, GraduationCap, Layers, Server, Sparkles, SquareTerminal } from "lucide-react";
import Image from "next/image";
import type { ProjectCategory } from "@/data/projects";
import { cx } from "@/lib/styles";

const icons: Record<ProjectCategory, typeof Server> = {
  backend: Server,
  fullstack: Layers,
  ai: Sparkles,
  games: Gamepad2,
  academic: GraduationCap,
};

type ProjectCoverProps = {
  slug: string;
  title: string;
  categories: ProjectCategory[];
  technologies: string[];
  image?: string;
  large?: boolean;
  priority?: boolean;
};

function hash(value: string) {
  return [...value].reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 7);
}

export function ProjectCover({ slug, title, categories, technologies, image, large, priority }: ProjectCoverProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt={title}
        fill
        priority={priority}
        sizes={large ? "(min-width: 1024px) 600px, 100vw" : "(min-width: 1024px) 400px, 100vw"}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    );
  }

  // Capa gerada para projetos sem screenshot
  const seed = hash(slug);
  const Icon = icons[categories[0]] ?? SquareTerminal;
  const glowX = 20 + (seed % 60);
  const glowY = 10 + ((seed >> 4) % 50);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-surface">
      <div className="bg-grid absolute inset-0 opacity-70" />
      <div
        className="absolute size-64 rounded-full bg-accent/20 blur-3xl transition-transform duration-700 group-hover:scale-125"
        style={{ left: `${glowX}%`, top: `${glowY}%`, transform: "translate(-50%, -50%)" }}
      />
      <div className="absolute inset-x-5 top-5 bottom-0 rounded-t-xl border border-b-0 border-line-strong bg-bg/60 backdrop-blur-[2px] transition-transform duration-500 group-hover:-translate-y-1">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="size-2 rounded-full bg-faint/60" />
          <span className="size-2 rounded-full bg-faint/60" />
          <span className="size-2 rounded-full bg-faint/60" />
          <span className="ml-2 truncate font-mono text-[10px] text-faint">~/{slug}</span>
        </div>
        <div className={cx("flex items-start justify-between gap-4 p-4", large && "sm:p-5")}>
          <div className="min-w-0 space-y-1.5 font-mono text-[11px] leading-tight">
            {technologies.slice(0, large ? 4 : 3).map((tech, index) => (
              <p key={tech} className="truncate text-muted">
                <span className="text-accent">{index === 0 ? "$" : ">"}</span> {tech.toLowerCase()}
              </p>
            ))}
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
            <Icon size={20} />
          </span>
        </div>
      </div>
      <Icon
        size={180}
        strokeWidth={1}
        className="absolute -right-6 -bottom-10 text-accent/[0.08] transition-transform duration-700 group-hover:-rotate-6"
      />
    </div>
  );
}
