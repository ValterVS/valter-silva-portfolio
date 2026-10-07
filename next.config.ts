import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
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
