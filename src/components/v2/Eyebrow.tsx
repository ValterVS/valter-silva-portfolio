export function Eyebrow({ index, children, id }: { index: string; children: string; id?: string }) {
  return (
    <p id={id} className="flex items-center gap-4 font-mono text-[11px] tracking-[0.32em] text-gold uppercase">
      <span className="text-faint">{index}</span>
      <span className="h-px w-10 bg-gold/50" aria-hidden="true" />
      {children}
    </p>
  );
}
