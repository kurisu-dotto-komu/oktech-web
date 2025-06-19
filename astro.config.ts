// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import icon from "astro-icon";
import yaml from "@rollup/plugin-yaml";
import { DEV_MODE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  // The full URL where the site will be hosted
  // This is used for generating absolute URLs (e.g., for OG images, canonical URLs)
  site: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://owddm.com/chris-wireframe/",
  // Base path for the site - available as import.meta.env.BASE_URL
  // On Vercel we use root path, otherwise we use /chris-wireframe
  base: process.env.VERCEL_URL ? "" : "chris-wireframe",
  trailingSlash: "never",
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss(), yaml()],
  },
  integrations: [react(), icon()],
  redirects: {
    discord: "https://discord.com/invite/k8xj8d75f6",
  },
  experimental: {
    responsiveImages: true,
    clientPrerender: true,
  },
  prefetch: {
    prefetchAll: true, // TODO disable in dev mode
    defaultStrategy: "viewport",
  },
});
