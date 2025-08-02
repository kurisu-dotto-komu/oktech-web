import { LuCalendar, LuMapPin } from "react-icons/lu";

import Link from "@/components/Common/LinkReact";
import type { EventEnriched } from "@/content";
import { formatDate, formatTime } from "@/utils/formatDate";

import EventCity from "./EventCity";

interface Props {
  event: EventEnriched;
  className?: string;
  class?: string;
}

export default function EventCompact({ event, className, class: classFromAstro }: Props) {
  const finalClassName = className || classFromAstro || "";

  const formattedDate = formatDate(event.data.dateTime, "short-no-year");
  const formattedTime = formatTime(event.data.dateTime);

  return (
    <Link
      href={`/event/${event.id}`}
      className={`hover:bg-base-200 flex items-center gap-4 rounded-lg p-3 transition-colors ${finalClassName}`}
    >
      <figure className="bg-base-300 h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
        {event.data.cover ? (
          <img
            src={event.data.cover.src}
            alt={event.data.title}
            className="h-full w-full object-cover"
            width={64}
            height={64}
          />
        ) : (
          <div className="bg-base-300 h-full w-full" />
        )}
      </figure>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold" data-testid="event-title">
          {event.data.title}
        </h3>
      </div>

      <div className="text-base-content/70 flex flex-shrink-0 items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <LuCalendar size={16} />
          <span
            className="whitespace-nowrap"
            data-testid="event-date"
            data-date={event.data.dateTime}
          >
            {formattedDate} • {formattedTime}
          </span>
        </div>

        {event.venue && (
          <div className="flex items-center gap-2">
            <LuMapPin size={16} />
            <span className="max-w-[200px] truncate">{event.venue.title}</span>
            {event.venue.city && (
              <div>
                <EventCity city={event.venue.city} />
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
