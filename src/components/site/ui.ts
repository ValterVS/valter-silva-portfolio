// Classes compartilhadas da home editorial. Tudo vem dos tokens de design-tokens.css.

const control =
  "inline-flex h-11 items-center gap-2 rounded-control px-4 text-small font-medium transition-colors duration-150";

export const action = {
  primary: `${control} bg-primary text-primary-foreground hover:bg-foreground`,
  secondary: `${control} border border-border-strong text-foreground hover:border-foreground`,
};

// Link de texto: sublinhado discreto que ganha a cor de destaque no hover.
export const textLink =
  "underline decoration-border-strong decoration-1 underline-offset-[0.2em] transition-colors hover:text-primary hover:decoration-primary";
