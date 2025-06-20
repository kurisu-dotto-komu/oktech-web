// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import icon from "astro-icon";
import yaml from "@rollup/plugin-yaml";
import { DEV_MODE } from "./src/config";

// Determine the site URL and base path
const isVercel = !!process.env.VERCEL_PROJECT_PRODUCTION_URL;
const isDev = process.env.NODE_ENV === "development";

const getSiteConfig = () => {
  if (isVercel) {
    return {
      site: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
      base: "",
    };
  }

  // In development, we still need to set site for proper URL generation
  if (isDev || (!isVercel && !process.env.SITE)) {
    return {
      site: "http://localhost:4322", // Using your dev server port
      base: "/chris-wireframe",
    };
  }

  // Production non-Vercel
  return {
    site: "https://owddm.com",
    base: "/chris-wireframe",
  };
};

const { site, base } = getSiteConfig();

// https://astro.build/config
export default defineConfig({
  site,
  base,
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
