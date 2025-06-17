// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import icon from "astro-icon";
import yaml from "@rollup/plugin-yaml";
import { DEV_MODE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://owddm.com/chris-wireframe/",
  // TODO update this for prod. for now, if we're on vercel, we dont need a base path
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
