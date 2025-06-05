export function resolveHref(href: string): string {
  // Base URL provided by Astro/Vite; defaults to "/" if undefined
  const base = (import.meta as any).env?.BASE_URL ?? "/";

  // Concatenate and normalise by removing duplicate slashes
  const parts = `${base}${href}`.split("/").filter(Boolean);
  return `/${parts.join("/")}`;
}
