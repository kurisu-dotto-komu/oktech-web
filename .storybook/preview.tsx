import type { Preview } from "@storybook/react-vite";
import React, { useEffect } from "react";
import "../src/styles/global.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#000000" },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";

      useEffect(() => {
        // Apply theme to the root html element
        document.documentElement.setAttribute("data-theme", theme);
      }, [theme]);

      return (
        <div className="min-h-screen bg-base-100 text-base-content p-8" data-theme={theme}>
          <Story />
        </div>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "DaisyUI theme",
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        showName: false,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
