import type { EventEnriched } from "@/content";

import EventCardCountdown from "../EventCard/EventCardCountdown";
import EventProjectorButton from "./EventProjectorButton";

export default function EventImageBig({ event }: { event: EventEnriched }) {
  return (
    <div className="group relative">
      <div className="absolute top-3 right-3 z-10">
        <EventProjectorButton event={event} />
      </div>
      <figure className="glass-card relative aspect-video w-full overflow-hidden">
        <div className="absolute top-3 left-3">
          <EventCardCountdown event={event} />
        </div>
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
    </div>
  );
}
