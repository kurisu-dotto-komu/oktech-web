import type { EventWithVenue } from "@/data";
import EventCompact from "@/components/Event/EventCompact";
import Section from "@/components/Common/Section";

interface Props {
  events: EventWithVenue[];
}

export default function EventsCompactView({ events }: Props) {
  return (
    <Section wide className="flex flex-col" data-testid="events-compact-view">
      {events.map((event) => (
        <div key={event.id} data-testid="event-card">
          <EventCompact event={event} className="border-b border-base-300 last:border-0" />
        </div>
      ))}
    </Section>
  );
}
