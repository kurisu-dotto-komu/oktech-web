import type { EventEnriched } from "@/content";

import EventCardCountdownAbsolute from "../EventCard/EventCardCountdownAbsolute";
import EventProjectorButton from "./EventProjectorButton";

export default function EventImageBig({ event }: { event: EventEnriched }) {
  return (
    <div className="group relative">
      <div className="absolute top-2 right-2">
        <EventProjectorButton event={event} />
      </div>
      <figure className="glass-card relative aspect-video w-full overflow-hidden">
        <EventCardCountdownAbsolute event={event} />
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
