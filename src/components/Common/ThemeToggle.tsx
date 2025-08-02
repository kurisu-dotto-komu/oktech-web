"use client";

import { LuMoon, LuSun } from "react-icons/lu";

interface ThemeToggleProps {
  testId?: string;
}

export default function ThemeToggle({ testId = "theme-switcher" }: ThemeToggleProps) {
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label="Toggle theme"
      data-testid={testId}
    >
      <LuMoon className="hidden h-5 w-5 dark:block" />
      <LuSun className="block h-5 w-5 dark:hidden" />
    </button>
  );
}
