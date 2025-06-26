import { getEvents, getPeople, getVenues } from "../data";
import { resolveFullUrl } from "./urlResolver";

/**
 * Generate event view route paths that actually exist
 */
export async function generateEventRoutePaths() {
  const paths: string[] = [];
  const views = ["", "compact", "gallery"]; // "" represents default view

  // Base paths for each view
  views.forEach((view) => {
    const basePath = view === "" ? "/events" : `/events/${view}`;
    paths.push(basePath);
  });

  return { paths };
}

/**
 * Core routes that are always present in the application.
 * They should start with a leading slash and have no trailing slash (except root).
 */
export const STATIC_ROUTES = ["/", "/about", "/events", "/people", "/sitemap"] as const;

/**
 * Generate a list of absolute URLs used in sitemaps.
 * Uses resolveFullUrl to ensure consistent URL generation.
 *
 * @returns Array of URL strings.
 */
export async function generateSitemapURLs(): Promise<string[]> {
  const urls: string[] = [];

  // Static pages
  urls.push(...STATIC_ROUTES.map((route) => resolveFullUrl(route)));

  // Event view variations
  const { paths: eventPaths } = await generateEventRoutePaths();
  eventPaths.forEach((path) => {
    urls.push(resolveFullUrl(path));
  });

  const events = await getEvents();
  events.forEach(({ id }) => {
    urls.push(resolveFullUrl(`/event/${id}`));
  });

  // Person pages
  const people = await getPeople();
  people.forEach(({ id }) => {
    urls.push(resolveFullUrl(`/person/${id}`));
  });

  // Venue pages
  const venues = await getVenues();
  venues.forEach(({ id }) => {
    urls.push(resolveFullUrl(`/venue/${id}`));
  });

  return urls;
}
