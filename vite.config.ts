import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png"
      ],
      manifest: {
        name: "Spirit KES | Artisanat de Luxe Africain",
        short_name: "Spirit KES",
        description: "Marque artisanale de luxe africaine. Sacs, sandales et accessoires en pagne. Formation et impact social à Brazzaville, Congo.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone", // "fullscreen" pour un écran plein
        start_url: "/",
        scope: "/",
        orientation: "portrait",
        lang: "fr-FR",
        categories: ["shopping", "fashion", "lifestyle", "business"],

        // Icônes - utilisez vos fichiers existants
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any"
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png"
          },
          {
            src: "/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png"
          }
        ],

        // Écrans de lancement (splash screens)
        screenshots: [
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "narrow",
            label: "Logo Spirit KES"
          }
        ],

        // Pour un meilleur contrôle du lancement
        prefer_related_applications: false,
        related_applications: []
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 an
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-static-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 an
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 jours
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources"
            }
          },
          {
            urlPattern: /^https:\/\/api\./i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 heure
              }
            }
          }
        ],
        // Options importantes pour le lancement
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
        suppressWarnings: false // Affiche les warnings en dev
      },
      // Stratégie de mise à jour
      manifestFilename: "manifest.webmanifest",
      strategies: "generateSW"
    }),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
        ? [
          import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer()
          ),
          import("@replit/vite-plugin-dev-banner").then((m) =>
              m.devBanner()
          ),
        ]
        : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: true // Utile pour le débogage
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});