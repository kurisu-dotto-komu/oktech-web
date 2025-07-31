import { useRef, useEffect } from "react";
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
        <summary className="btn" aria-label="Subscribe">
          <LuRss className="w-4 h-4" />
        </summary>
        <div className="dropdown-content z-50 p-2 shadow bg-base-100 rounded-box w-48 mt-1 flex flex-col gap-2">
          <a
            href="/oktech-events.ics"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost justify-start gap-3 w-full"
            data-testid="subscribe-ics"
          >
            <LuCalendar className="w-4 h-4" />
            Calendar
          </a>
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost justify-start gap-3 w-full"
            data-testid="subscribe-rss"
          >
            <LuRss className="w-4 h-4" />
            RSS Feed
          </a>
        </div>
      </details>
    </div>
  );
}
