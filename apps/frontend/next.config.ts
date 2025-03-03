/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.casino-assets.com", "game-providers.com"],
    formats: ["image/avif", "image/webp"],
  },
  i18n: {
    locales: ["pl", "en", "de", "es"],
    defaultLocale: "pl",
  },
  experimental: {
    serverActions: true,
    optimizeCss: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; connect-src 'self' http://localhost:3001 ws://localhost:3001;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
