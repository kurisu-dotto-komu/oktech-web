import { useEffect, useRef } from "react";

import { FaGoogle, FaYahoo } from "react-icons/fa6";
import { LuCalendar, LuCalendarPlus, LuChevronDown, LuRss } from "react-icons/lu";

import type { EventEnriched } from "@/content/events";
import { resolveBaseUrl } from "@/utils/urlResolver";

interface AddToCalendarDropdownProps {
  event: EventEnriched;
}

export default function AddToCalendarDropdown({ event }: AddToCalendarDropdownProps) {
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.open &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dropdownRef.current.open = false;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate calendar URLs
  const baseUrl = resolveBaseUrl();
  const eventUrl = `${baseUrl}/event/${event.id}`;

  // Format dates for calendar links
  const startDate = new Date(event.data.dateTime);
  const endDate = new Date(event.data.dateTime);
  const duration = event.data.duration || 2;
  endDate.setHours(endDate.getHours() + duration);

  // Format dates as YYYYMMDDTHHMMSSZ
  const formatDate = (date: Date) => {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  };

  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);

  // Event details
  const title = encodeURIComponent(event.data.title);
  const details = encodeURIComponent(`${event.data.title} - OK Tech Meetup\n\n${eventUrl}`);
  const location = encodeURIComponent(
    event.venue?.title
      ? `${event.venue.title}${event.venue.address ? `, ${event.venue.address}` : ""}`
      : "TBD",
  );

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedStart}/${formattedEnd}&details=${details}&location=${location}&sf=true`;
  const yahooUrl = `https://calendar.yahoo.com/?v=60&title=${title}&st=${formattedStart}&et=${formattedEnd}&desc=${details}&in_loc=${location}`;

  return (
    <details
      className="dropdown dropdown-bottom w-full"
      ref={dropdownRef}
      data-testid="add-to-calendar-dropdown"
    >
      <summary className="btn btn-lg w-full gap-4">
        Add to Calendar
        <LuCalendarPlus />
        <LuChevronDown className="h-4 w-4" />
      </summary>
      <div className="dropdown-content bg-base-100 rounded-box z-50 mt-1 flex w-full max-w-full flex-col gap-2 p-2 shadow">
        <a
          href={`/event/${event.id}.ics`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost w-full justify-start gap-3"
          data-testid="calendar-ical"
        >
          <LuCalendar className="h-4 w-4" />
          Outlook / iCal
        </a>
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost w-full justify-start gap-3"
          data-testid="calendar-google"
        >
          <FaGoogle className="h-4 w-4" />
          Google Calendar
        </a>
        <a
          href={yahooUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost w-full justify-start gap-3"
          data-testid="calendar-yahoo"
        >
          <FaYahoo className="h-4 w-4" />
          Yahoo Calendar
        </a>
        <div className="divider my-0"></div>
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost w-full justify-start gap-3"
          data-testid="subscribe-rss"
        >
          <LuRss className="h-4 w-4" />
          Subscribe with RSS
        </a>
        <a
          href={`/oktech-events.ics`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost w-full justify-start gap-3"
          data-testid="subscribe-ics"
        >
          <LuCalendar className="h-4 w-4" />
          Subscribe to ICS
        </a>
      </div>
    </details>
  );
}
