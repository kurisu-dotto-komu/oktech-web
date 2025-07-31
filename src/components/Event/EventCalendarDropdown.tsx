import { useRef, useEffect } from "react";
import { LuCalendarPlus, LuChevronDown, LuCalendar } from "react-icons/lu";
import { FaGoogle, FaYahoo } from "react-icons/fa6";
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
        <LuChevronDown className="w-4 h-4" />
      </summary>
      <div className="dropdown-content z-50 p-2 shadow bg-base-100 rounded-box w-full max-w-full mt-1 flex flex-col gap-2">
        <a
          href={`/event/${event.id}/event.ics`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost justify-start gap-3 w-full"
          data-testid="calendar-ical"
        >
          <LuCalendar className="w-4 h-4" />
          Outlook / iCal
        </a>
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost justify-start gap-3 w-full"
          data-testid="calendar-google"
        >
          <FaGoogle className="w-4 h-4" />
          Google Calendar
        </a>
        <a
          href={yahooUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost justify-start gap-3 w-full"
          data-testid="calendar-yahoo"
        >
          <FaYahoo className="w-4 h-4" />
          Yahoo Calendar
        </a>
      </div>
    </details>
  );
}
