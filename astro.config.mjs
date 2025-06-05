// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import icon from "astro-icon";
import yaml from '@rollup/plugin-yaml';
import sitemap from "@astrojs/sitemap";


// https://astro.build/config
export default defineConfig({
  site: process.env.VERCEL_URL? `https://${process.env.VERCEL_URL}` : "https://owddm.com/chris-wireframe/",
  // TODO update this for prod. for now, if we're on vercel, we dont need a base path
  base: process.env.VERCEL_URL ? "" : "chris-wireframe", 
  trailingSlash: "never",
  vite: {
    plugins: [tailwindcss(), yaml()],
  },
  integrations: [react(), icon(), sitemap({ exclude: ['/sitemap'] })],
  redirects: {
    discord: "https://discord.com/invite/k8xj8d75f6",
  },
  experimental: {
    responsiveImages: true,
    clientPrerender: true,
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
