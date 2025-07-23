import { LuCalendar, LuMapPin } from "react-icons/lu";
import type { EventEnriched } from "@/content";
import Link from "@/components/Common/LinkReact";
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
      className={`flex items-center gap-4 p-3 rounded-lg hover:bg-base-200 transition-colors ${finalClassName}`}
    >
      <figure className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-base-300">
        {event.data.cover ? (
          <img
            src={event.data.cover.src}
            alt={event.data.title}
            className="w-full h-full object-cover"
            width={64}
            height={64}
          />
        ) : (
          <div className="w-full h-full bg-base-300" />
        )}
      </figure>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base truncate" data-testid="event-title">
          {event.data.title}
        </h3>
      </div>

      <div className="flex items-center gap-6 text-sm text-base-content/70 flex-shrink-0">
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
