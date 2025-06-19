/**
 * Resolves a path to a full URL including protocol, domain, and base path
 * @param path - The path to resolve (e.g., "/api/og.png")
 * @param origin - The origin URL (defaults to current origin or fallback)
 * @returns The full URL
 */
export function resolveUrl(path: string, origin?: string | URL): string {
  // Get the base URL path from Astro (e.g., "/" or "/chris-wireframe")
  const basePath = import.meta.env.BASE_URL || "/";

  // Determine the origin
  let baseOrigin: string;
  if (origin) {
    baseOrigin = typeof origin === "string" ? origin : origin.origin;
  } else if (typeof window !== "undefined") {
    // Client-side: use current origin
    baseOrigin = window.location.origin;
  } else {
    // Server-side: determine from environment
    // On Vercel, BASE_URL is "/" so we don't need special handling
    const vercelUrl = import.meta.env.PUBLIC_VERCEL_URL || import.meta.env.VERCEL_URL;
    if (vercelUrl) {
      baseOrigin = `https://${vercelUrl}`;
    } else if (import.meta.env.SITE) {
      // SITE from astro.config.ts includes full URL with base path
      const siteUrl = new URL(import.meta.env.SITE);
      baseOrigin = siteUrl.origin;
    } else if (import.meta.env.DEV) {
      baseOrigin = "http://localhost:5173";
    } else {
      baseOrigin = "https://owddm.com";
    }
  }

  // Handle the path - remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Combine origin, base path, and the specific path
  // The basePath already has the correct value from astro.config.ts
  const fullPath =
    basePath === "/" ? `/${cleanPath}` : `${basePath}/${cleanPath}`.replace(/\/+/g, "/");

  return `${baseOrigin}${fullPath}`;
}

/**
 * Get the site's base URL (origin + base path)
 * @param origin - Optional origin to use
 * @returns The base URL for the site
 */
export function getSiteUrl(origin?: string | URL): string {
  return resolveUrl("/", origin).replace(/\/$/, ""); // Remove trailing slash
}
