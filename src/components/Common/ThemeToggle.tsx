"use client";

import { LuSun, LuMoon } from "react-icons/lu";

interface ThemeToggleProps {
  testId?: string;
}

export default function ThemeToggle({ testId = "theme-toggle" }: ThemeToggleProps) {
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "oktech-dark" ? "oktech-light" : "oktech-dark";
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
      <LuMoon className="hidden [[data-theme='oktech-light']_&]:block h-5 w-5" />
      <LuSun className="hidden [[data-theme='oktech-dark']_&]:block h-5 w-5" />
    </button>
  );
}
