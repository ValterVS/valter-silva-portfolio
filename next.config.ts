import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Arquivos de public/models (retrato da hero) mudam raramente: cache de 1 dia no navegador e na CDN,
  // revalidando em segundo plano. Sem isso a Vercel serve com max-age=0 e cada visita revalida.
  async headers() {
    return [
      {
        source: "/models/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
  // A versão imersiva ficou em /v2 enquanto era experimental; agora ela é a home.
  async redirects() {
    return [
      { source: "/v2", destination: "/", permanent: true },
      { source: "/en/v2", destination: "/en", permanent: true },
    ];
  },
};

export default nextConfig;
