import type { EventEnriched } from "@/content";
import { filterUpcomingEvents } from "@/utils/eventFilters";

import EventCard from "../EventCard/EventCard";

interface EventsUpcomingProps {
  events: EventEnriched[];
}

export default function EventsUpcoming({ events }: EventsUpcomingProps) {
  const futureEvents = filterUpcomingEvents(events).reverse();
  const [nextEvent] = futureEvents;

  if (!nextEvent) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8" data-testid="events-upcoming">
      <h2 className="text-center text-3xl" data-testid="upcoming-events-title">
        Upcoming Events
      </h2>
      <div className="flex flex-col gap-4">
        {futureEvents.map((event) => (
          <EventCard key={event.id} event={event} variant="big" />
        ))}
      </div>
    </div>
  );
}
