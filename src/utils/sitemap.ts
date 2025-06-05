import { getEvents, POSSIBLE_ROLES } from "../data";

/**
 * Core routes that are always present in the application.
 * They should start with a leading slash and have no trailing slash (except root).
 */
export const STATIC_ROUTES = ["/", "/about", "/events", "/community", "/sitemap"] as const;

/**
 * Generate a list of absolute or relative URLs used in sitemaps.
 *
 * @param base Optional prefix (e.g. "https://example.com/"). Leave empty (default) to
 *             return relative paths starting with "/".
 * @returns Array of URL strings.
 */
export async function generateSitemapURLs(base = ""): Promise<string[]> {
  // Normalise base – ensure empty or ends with single slash.
  const prefix = base === "" ? "" : base.replace(/\/?$/, "/");

  const urls: string[] = [];

  // Static pages
  urls.push(...STATIC_ROUTES.map((route) => toUrl(prefix, route)));

  // Community role filter pages
  POSSIBLE_ROLES.forEach((role) => {
    urls.push(toUrl(prefix, `/community/${role}`));
  });

  // Event pages
  const events = await getEvents();
  events.forEach(({ id }) => {
    urls.push(toUrl(prefix, `/event/${id}`));
  });

  return urls;
}

function toUrl(prefix: string, path: string) {
  if (prefix === "") return path;
  return `${prefix}${path.replace(/^\//, "")}`;
}