import type { EventEnriched } from "@/content";
import EventCompact from "@/components/Event/EventCompact";
import Section from "@/components/Common/Section";
import { groupEventsByYearAndUpcoming } from "@/utils/eventGrouping";
import { useEventsFilter } from "./EventsFilterProvider";

interface Props {
  events: EventEnriched[];
}

export default function EventsCompactView({ events }: Props) {
  const { currentFilters } = useEventsFilter();
  const eventGroups = groupEventsByYearAndUpcoming(events, currentFilters.sort);

  return (
    <div data-testid="events-compact-view">
      {eventGroups.map((group) => (
        <Section
          key={group.label}
          wide
          title={group.label}
          className="flex flex-col mb-12 last:mb-0"
        >
          {group.events.map((event) => (
            <div key={event.id} data-testid="event-card">
              <EventCompact event={event} className="border-b border-base-300 last:border-0" />
            </div>
          ))}
        </Section>
      ))}
    </div>
  );
}
