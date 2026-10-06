import { ImageResponse } from "next/og";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { profile } from "@/data/profile";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const subtitle = {
  pt: "Desenvolvimento backend · Java · Spring Boot · APIs",
  en: "Backend development · Java · Spring Boot · APIs",
};

// Imagem de compartilhamento (Open Graph) gerada no build
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : defaultLocale;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 85% 20%, rgba(56,189,248,0.22), transparent 55%), #06080c",
          color: "#e7edf4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              border: "2px solid rgba(56,189,248,0.5)",
              background: "rgba(56,189,248,0.1)",
              color: "#38bdf8",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#94a0b2" }}>valtersilva.dev.br</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#38bdf8" }}>{profile.role}</div>
          <div style={{ display: "flex", marginTop: 12, fontSize: 92, fontWeight: 700, letterSpacing: -3 }}>
            {profile.name}
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 30, color: "#94a0b2" }}>{subtitle[locale]}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
