import { SITE } from "@/constants";
import type { EventEnriched } from "@/content";

import { resolveFullUrl } from "./urlResolver";

export function formatICSDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export function formatICSDateWithTimezone(date: Date): string {
  // Reason: Format date in local JST time for TZID parameter
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

export function generateEventICS(event: EventEnriched): string {
  const startDate = new Date(event.data.dateTime);
  const endDate = new Date(event.data.dateTime);
  const durationMinutes = event.data.duration || 120;
  endDate.setMinutes(endDate.getMinutes() + durationMinutes);

  const eventUrl = resolveFullUrl(`/event/${event.id}/`);
  const location = event.venue?.title
    ? `${event.venue.title}${event.venue.address ? `, ${event.venue.address}` : ""}`
    : "TBD";

  return [
    "BEGIN:VEVENT",
    `UID:${event.id}@OKTECH`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART;TZID=Asia/Tokyo:${formatICSDateWithTimezone(startDate)}`,
    `DTEND;TZID=Asia/Tokyo:${formatICSDateWithTimezone(endDate)}`,
    `SUMMARY:${event.data.title}`,
    `DESCRIPTION:${event.data.title} - ${SITE.longName}\\n\\n${eventUrl}`,
    `LOCATION:${location}`,
    `URL:${eventUrl}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
  ].join("\r\n");
}

export function wrapICSCalendar(events: string | string[], calName?: string): string {
  const eventsContent = Array.isArray(events) ? events.join("\r\n") : events;

  // Reason: Add JST timezone definition for proper calendar display
  const timezoneDefinition = [
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Tokyo",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0900",
    "TZOFFSETTO:+0900",
    "TZNAME:JST",
    "END:STANDARD",
    "END:VTIMEZONE",
  ].join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE.name}//Event Calendar//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...(calName ? [`X-WR-CALNAME:${calName}`] : []),
    ...(calName ? [`X-WR-CALDESC:Events from ${calName}`] : []),
    "X-WR-TIMEZONE:Asia/Tokyo",
    timezoneDefinition,
    eventsContent,
    "END:VCALENDAR",
  ].join("\r\n");
}
