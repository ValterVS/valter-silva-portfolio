import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie, localePath } from "@/i18n/config";

// O português fica na raiz (/) e os outros idiomas ganham prefixo (/en).
// Internamente tudo é servido por app/[locale], por isso a raiz é reescrita para /pt.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1];

  // /pt/... é sempre o mesmo endereço sem prefixo: redirecionamento permanente (308).
  // O redirecionamento pelo cookie de idioma, abaixo, continua temporário (307), pois depende do visitante.
  if (segment === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(segment)) return NextResponse.next();

  const saved = request.cookies.get(localeCookie)?.value;
  if (saved && saved !== defaultLocale && isLocale(saved)) {
    const url = request.nextUrl.clone();
    url.pathname = localePath(saved, pathname);
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|og|.*\\..*).*)"],
};
