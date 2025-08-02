import { useEffect, useRef } from "react";

import { LuCalendar, LuRss } from "react-icons/lu";

export default function EventsSubscribeDropdown() {
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

  return (
    <div className="tooltip" data-tip="Subscribe">
      <details
        className="dropdown dropdown-bottom dropdown-end"
        ref={dropdownRef}
        data-testid="events-subscribe-dropdown"
      >
        <summary className="btn btn-warning btn-outline" aria-label="Subscribe">
          <LuRss className="h-4 w-4" />
        </summary>
        <div className="dropdown-content bg-base-100 rounded-box z-50 mt-1 flex w-48 flex-col gap-2 p-2 shadow">
          <a
            href="/oktech-events.ics"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost w-full justify-start gap-3"
            data-testid="subscribe-ics"
          >
            <LuCalendar className="h-4 w-4" />
            Calendar
          </a>
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost w-full justify-start gap-3"
            data-testid="subscribe-rss"
          >
            <LuRss className="h-4 w-4" />
            RSS Feed
          </a>
        </div>
      </details>
    </div>
  );
}
