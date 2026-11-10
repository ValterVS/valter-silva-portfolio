import Link from "next/link";
import { action } from "@/components/site/ui";

// 404 bilíngue: o idioma da URL desconhecida nem sempre é confiável.
export default function NotFound() {
  return (
    <main id="content" className="mx-auto flex min-h-svh max-w-content flex-col justify-center px-gutter py-section">
      <p className="text-small text-foreground-muted">404</p>
      <h1 className="mt-3 font-display text-title font-medium">
        Página não encontrada
        <span className="mt-1 block text-heading font-normal text-foreground-muted" lang="en">
          Page not found
        </span>
      </h1>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={action.primary}>
          Voltar ao início
        </Link>
        <Link href="/en" className={action.secondary} lang="en">
          Back to home
        </Link>
      </div>
    </main>
  );
}
