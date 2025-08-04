import EventSummary from "@/components/Event/EventSummary";
import type { EventEnriched } from "@/content";
import { filterUpcomingEvents } from "@/utils/eventFilters";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {futureEvents.map((event) => (
          <EventSummary key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
