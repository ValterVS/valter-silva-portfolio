export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98]";

export const button = {
  primary: `${base} h-11 px-5 bg-accent text-bg shadow-[0_0_0_1px_rgb(56_189_248/0.4),0_8px_30px_-8px_rgb(56_189_248/0.6)] hover:bg-accent-soft`,
  secondary: `${base} h-11 px-5 border border-line-strong bg-surface-2/70 text-fg hover:border-accent/50 hover:bg-surface-2`,
  ghost: `${base} h-11 px-4 text-muted hover:text-fg`,
  small: `${base} h-9 px-3.5 border border-line bg-surface-2/60 text-fg/90 hover:border-accent/50 hover:text-fg`,
  icon: `${base} size-9 border border-line text-muted hover:border-line-strong hover:text-fg`,
};

export const chip =
  "inline-flex items-center rounded-md border border-line bg-surface-2/60 px-2 py-1 font-mono text-[11px] leading-none text-muted";
