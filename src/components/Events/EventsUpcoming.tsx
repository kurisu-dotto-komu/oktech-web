import EntryCard from "@/components/EntryCard/EntryCard";
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
    <div className="flex flex-col gap-24 xl:gap-32" data-testid="upcoming-events-section">
      <h2 className="text-center text-3xl" data-testid="upcoming-events-title">
        Upcoming Events
      </h2>
      {futureEvents.map((event, index) => (
        <EntryCard key={event.id} event={event} presetIndex={index} />
      ))}
    </div>
  );
}
