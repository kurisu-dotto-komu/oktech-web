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

export default function EventSummary({ event, className, class: classFromAstro }: Props) {
  const finalClassName = className || classFromAstro || "";

  const formattedDate = formatDate(event.data.dateTime, "short-no-year");
  const formattedTime = formatTime(event.data.dateTime);

  return (
    <Link
      href={`/event/${event.id}`}
      className={`card card-border bg-base-100 hover-zoom ${finalClassName}`}
    >
      <figure className="aspect-video w-full bg-base-300">
        {event.data.cover ? (
          <img
            src={event.data.cover.src}
            alt={event.data.title}
            className="w-full h-full object-cover"
            width={512}
            height={512}
          />
        ) : (
          <div className="w-full h-full bg-base-300" />
        )}
      </figure>
      <div className="card-body p-4 gap-4 flex flex-col">
        <h3 className="card-title text-lg" data-testid="event-title">
          {event.data.title}
        </h3>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex gap-2 items-center">
            <LuCalendar size={16} />
            <span data-testid="event-date" data-date={event.data.dateTime}>
              {formattedDate} • {formattedTime}
            </span>
          </div>
          {event.venue && (
            <div className="flex gap-2 items-center text-base-content/70">
              <LuMapPin size={16} />
              <span>{event.venue.title}</span>
              {event.venue.city && (
                <div className="ml-auto">
                  <EventCity city={event.venue.city} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
