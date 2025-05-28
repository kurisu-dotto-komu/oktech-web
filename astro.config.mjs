// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import icon from "astro-icon";
import yaml from '@rollup/plugin-yaml';


// https://astro.build/config
export default defineConfig({
  site: "https://owddm.com/chris-wireframe/",
  base: "chris-wireframe",
  trailingSlash: "never",
  vite: {
    plugins: [tailwindcss(), yaml()],
  },
  integrations: [react(), icon()],
  redirects: {
    discord: "https://discord.com/invite/k8xj8d75f6",
  },
});
