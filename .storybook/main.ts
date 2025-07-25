import type { StorybookConfig } from "@storybook/react-vite";
import { resolve } from "path";

const config: StorybookConfig = {
  stories: ["./stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": resolve(__dirname, "../src"),
    };

    // Add Tailwind CSS plugin dynamically
    const tailwindPlugin = await import("@tailwindcss/vite").then((m) => m.default);
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindPlugin());

    // Serve content directory as static files
    config.server = config.server || {};
    config.server.fs = {
      ...config.server.fs,
      allow: [resolve(__dirname, "..")],
    };

    return config;
  },
  staticDirs: ["../content"],
};
export default config;
