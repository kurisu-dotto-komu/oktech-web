"use client";

import { useEffect, useState } from "react";
import { LuSun, LuMoon } from "react-icons/lu";

interface ThemeToggleProps {
  testId?: string;
}

export default function ThemeToggle({ testId = "theme-toggle" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"oktech-light" | "oktech-dark">(() => {
    // Initialize from current data-theme attribute (set by RootLayout)
    if (typeof window !== "undefined") {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      return currentTheme === "oktech-dark" ? "oktech-dark" : "oktech-light";
    }
    return "oktech-light";
  });

  useEffect(() => {
    // Apply theme whenever it changes
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "oktech-light" ? "oktech-dark" : "oktech-light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label={`Switch to ${theme === "oktech-light" ? "dark" : "light"} mode`}
      data-testid={testId}
    >
      {theme === "oktech-light" ? <LuMoon className="h-5 w-5" /> : <LuSun className="h-5 w-5" />}
    </button>
  );
}
