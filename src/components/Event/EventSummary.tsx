import Link from "@/components/Common/LinkReact";
import EventIconList from "@/components/Event/EventIconList";
import type { EventEnriched } from "@/content";

import EventCity from "./EventCity";

interface Props {
  event: EventEnriched;
  className?: string;
  class?: string;
}

export default function EventSummary({ event, className, class: classFromAstro }: Props) {
  const finalClassName = className || classFromAstro || "";

  return (
    <Link
      href={`/event/${event.id}`}
      className={`card card-border bg-base-100 hover-zoom ${finalClassName}`}
    >
      <figure className="bg-base-300 aspect-video w-full">
        {event.data.cover ? (
          <img
            src={event.data.cover.src}
            alt={event.data.title}
            className="h-full w-full object-cover"
            width={512}
            height={512}
          />
        ) : (
          <div className="bg-base-300 h-full w-full" />
        )}
      </figure>
      <div className="card-body flex flex-col gap-4 p-4">
        <h3 className="card-title line-clamp-2 text-lg" data-testid="event-title">
          {event.data.title}
        </h3>
        <EventIconList event={event} stats={["date", "time", "venue", "city"]} showCountdown />
      </div>
    </Link>
  );
}
