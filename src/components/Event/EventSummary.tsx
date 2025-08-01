import type { EventEnriched } from "@/content";
import Link from "@/components/Common/LinkReact";
import EventIconList from "@/components/Event/EventIconList";
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
        <div className="relative">
          <EventIconList event={event} stats={["date", "time", "venue"]} />
          {event.venue?.city && (
            <div className="absolute top-0 right-0">
              <EventCity city={event.venue.city} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
