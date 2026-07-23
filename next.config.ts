import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF pre WebP-a: 20–30% manje za isti kvalitet. next/image sam bira
    // format koji brauzer podržava (fallback na WebP, pa JPEG).
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
