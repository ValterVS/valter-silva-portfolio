import Link from "next/link";
import { button } from "@/lib/styles";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70svh] flex-col items-start justify-center pt-28 pb-20">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        Página não encontrada
        <span className="mt-1 block text-xl font-normal text-muted sm:text-2xl" lang="en">
          Page not found
        </span>
      </h1>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={button.primary}>
          Voltar ao início
        </Link>
        <Link href="/en" className={button.secondary} lang="en">
          Back to home
        </Link>
      </div>
    </section>
  );
}
