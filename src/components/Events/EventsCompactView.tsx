import Section from "@/components/Common/Section";
import EventCompact from "@/components/Event/EventCompact";
import type { EventEnriched } from "@/content";
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
          className="mb-12 flex flex-col last:mb-0"
        >
          {group.events.map((event) => (
            <div key={event.id} data-testid="event-card">
              <EventCompact event={event} className="border-base-300 border-b last:border-0" />
            </div>
          ))}
        </Section>
      ))}
    </div>
  );
}
