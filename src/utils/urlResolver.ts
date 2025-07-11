/**
 * URL resolution utilities for consistent URL handling across the application
 */

/**
 * Get the base URL for the site (origin + base path)
 * Uses Astro's SITE config which is set in astro.config.ts
 * @returns The base URL including origin and base path (e.g., "http://localhost:4322/chris-wireframe")
 */
export function resolveBaseUrl(): string {
  // Astro provides SITE from astro.config.ts
  const site = import.meta.env.SITE;
  const basePath = import.meta.env.BASE_URL || "/";

  if (!site) {
    // This shouldn't happen if astro.config.ts is set up correctly
    console.warn("SITE env var not found, using fallback");
    return `http://localhost:4322${basePath}`.replace(/\/$/, "");
  }

  // Combine site and base path
  if (basePath === "/") {
    return site.replace(/\/$/, "");
  }

  return `${site.replace(/\/$/, "")}${basePath}`.replace(/\/$/, "");
}

/**
 * Resolve an internal href/path with the base path
 * @param href - The internal path (e.g., "/about", "/event/123")
 * @returns The path with base path prefix (e.g., "/chris-wireframe/about")
 */
export function resolveInternalHref(href: string): string {
  const basePath = import.meta.env.BASE_URL || "/";

  // Handle empty href
  if (!href || href === "/") {
    return basePath;
  }

  // Ensure href starts with /
  const cleanHref = href.startsWith("/") ? href : `/${href}`;

  // If basePath is just "/", return the href as-is
  if (basePath === "/") {
    return cleanHref;
  }

  // Combine base path and href, avoiding double slashes
  return `${basePath}${cleanHref}`.replace(/\/+/g, "/");
}

/**
 * Get the full URL for an internal path
 * @param href - The internal path (e.g., "/about", "/event/123")
 * @returns The full URL (e.g., "http://localhost:4321/chris-wireframe/about")
 */
export function resolveFullUrl(href: string): string {
  const baseUrl = resolveBaseUrl();
  const internalHref = resolveInternalHref(href);

  // If the internal href already includes the base path, don't double it
  if (internalHref.startsWith(baseUrl)) {
    return internalHref;
  }

  // Combine, but remove the base path from baseUrl first to avoid duplication
  const basePath = import.meta.env.BASE_URL || "/";
  const origin = baseUrl.replace(new RegExp(`${basePath}$`), "");

  return `${origin}${internalHref}`;
}
