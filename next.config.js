/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Next.js 15

  // Configuration des packages externes pour les Server Components
  serverExternalPackages: ["prisma", "@prisma/client"],

  // Configuration Turbopack (stable)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Configuration des images
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Configuration des headers de sécurité
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Configuration des redirections
  async redirects() {
    return [
      {
        source: "/todos",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Configuration de la compilation
  compiler: {
    // Supprimer les console.log en production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Configuration des variables d'environnement
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Configuration du bundler
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimisations webpack personnalisées
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
