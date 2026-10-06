import { usePathname, useRouter } from "next/navigation";
import { isLocale, localeCookie, localePath, type Locale } from "@/i18n/config";

function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  if (!isLocale(segments[1] ?? "")) return pathname;
  return "/" + segments.slice(2).join("/");
}

function rememberLocale(locale: Locale) {
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

// Troca de idioma mantendo a página atual; a escolha fica salva no cookie lido pelo proxy.
export function useSwitchLocale() {
  const pathname = usePathname();
  const router = useRouter();

  return (next: Locale) => {
    rememberLocale(next);
    router.push(localePath(next, stripLocale(pathname)) + window.location.hash, { scroll: false });
  };
}
