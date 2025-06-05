import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE } from "../config";
import { getEvents } from "../data";
import { formatDate } from "../utils/formatDate";
import { resolveHref } from "../utils/resolveHref";

export async function GET(context: APIContext) {
  const events = await getEvents();

  // Sort events by date (newest first)
  const sortedEvents = events.sort(
    (a, b) => new Date(b.data.dateTime).getTime() - new Date(a.data.dateTime).getTime(),
  );

  // Use the current URL's origin in development
  const site = context.site ? context.site.toString() : context.url.origin;

  return rss({
    title: `${SITE.name} - Events`,
    description: `Stay updated with the latest events from ${SITE.longName}`,
    site: site,
    items: sortedEvents.map((event) => ({
      title: event.data.title,
      description: `Event on ${formatDate(event.data.dateTime, "long")}`,
      pubDate: new Date(event.data.dateTime),
      link: resolveHref(`/event/${event.id}/`),
    })),
    customData: `<language>en-us</language>`,
  });
}
