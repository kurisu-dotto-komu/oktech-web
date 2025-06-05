import { getEvents, POSSIBLE_ROLES } from "../data";

export async function GET() {
  // Base site URL from the Astro runtime, falls back to root when not set (e.g. in dev).
  const site = (import.meta as any).env.SITE as string | undefined;
  const base = site ? site.replace(/\/?$/, "/") : "/";

  const urls: string[] = [];

  // Core static pages
  urls.push(base);
  urls.push(`${base}about`);
  urls.push(`${base}events`);
  urls.push(`${base}community`);
  urls.push(`${base}sitemap`);

  // Community role filter pages
  POSSIBLE_ROLES.forEach((role) => {
    urls.push(`${base}community/${role}`);
  });

  // Individual event pages
  const events = await getEvents();
  events.forEach(({ id }) => {
    urls.push(`${base}event/${id}`);
  });

  // Compose the XML document
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc></url>`) // one entry per URL
    .join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
