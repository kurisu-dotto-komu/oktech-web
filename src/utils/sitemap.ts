import { getEvents, POSSIBLE_ROLES, getMembers, getVenues } from "../data";

/**
 * Generate all event route paths for different views and filters
 */
export async function generateEventRoutePaths() {
  const events = await getEvents();
  
  // Get all unique topics
  const topicsSet = new Set<string>();
  events.forEach(event => {
    if (event.data.topics) {
      event.data.topics.forEach((topic: string) => {
        const slug = topic
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        topicsSet.add(slug);
      });
    }
  });

  // Get all unique cities
  const citiesSet = new Set<string>();
  events.forEach(event => {
    if (event.venue?.city) {
      citiesSet.add(event.venue.city);
    }
  });

  const paths: string[] = [];
  const views = ["", "compact", "gallery"]; // "" represents default view

  // Base paths for each view
  views.forEach(view => {
    const basePath = view === "" ? "/events" : `/events/${view}`;
    paths.push(basePath);
  });

  // Topic filter paths
  views.forEach(view => {
    topicsSet.forEach(topic => {
      const basePath = view === "" ? "/events" : `/events/${view}`;
      paths.push(`${basePath}/topic/${topic}`);
    });
  });

  // Location filter paths
  views.forEach(view => {
    citiesSet.forEach(city => {
      const basePath = view === "" ? "/events" : `/events/${view}`;
      paths.push(`${basePath}/location/${encodeURIComponent(city)}`);
    });
  });

  return { paths, topics: Array.from(topicsSet), cities: Array.from(citiesSet) };
}

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

  // Static pages (excluding /events since it's handled below)
  const staticRoutesWithoutEvents = STATIC_ROUTES.filter(route => route !== "/events");
  urls.push(...staticRoutesWithoutEvents.map((route) => toUrl(prefix, route)));

  // Community role filter pages
  POSSIBLE_ROLES.forEach((role) => {
    urls.push(toUrl(prefix, `/community/${role}`));
  });

  // All event route variations (views and filters)
  const { paths: eventPaths } = await generateEventRoutePaths();
  eventPaths.forEach(path => {
    urls.push(toUrl(prefix, path));
  });

  // Individual event pages
  const events = await getEvents();
  events.forEach(({ id }) => {
    urls.push(toUrl(prefix, `/event/${id}`));
  });

  // Member pages
  const members = await getMembers();
  members.forEach(({ id }) => {
    urls.push(toUrl(prefix, `/member/${id}`));
  });

  // Venue pages
  const venues = await getVenues();
  venues.forEach(({ id }) => {
    urls.push(toUrl(prefix, `/venue/${id}`));
  });

  return urls;
}

function toUrl(prefix: string, path: string) {
  if (prefix === "") return path;
  return `${prefix}${path.replace(/^\//, "")}`;
}