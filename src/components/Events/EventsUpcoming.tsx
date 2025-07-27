import EntryCard from "@/components/Event/EntryCard/EntryCard";
import type { EventEnriched } from "@/content";

interface EventsUpcomingProps {
  events: EventEnriched[];
}

export default function EventsUpcoming({ events }: EventsUpcomingProps) {
  const futureEvents = events.filter((event) => event.data.dateTime > new Date()).reverse();
  const [nextEvent] = futureEvents;

  if (!nextEvent) {
    return null;
  }

  return (
    <div className="flex flex-col gap-24 xl:gap-32">
      <h2 className="text-center text-3xl">Upcoming Events</h2>
      {futureEvents.map((event, index) => (
        <EntryCard key={event.id} event={event} presetIndex={index} />
      ))}
    </div>
  );
}
