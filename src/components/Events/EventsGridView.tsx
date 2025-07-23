import type { EventEnriched } from "@/content";
import EventSummary from "@/components/Event/EventSummary";
import Section from "@/components/Common/Section";

interface Props {
  events: EventEnriched[];
}

export default function EventsGridView({ events }: Props) {
  return (
    <Section grid wide data-testid="events-grid-view">
      {events.map((event) => (
        <div key={event.id} data-testid="event-card">
          <EventSummary event={event} />
        </div>
      ))}
    </Section>
  );
}
