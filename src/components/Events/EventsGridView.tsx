import Section from "@/components/Common/Section";
import EventSummary from "@/components/Event/EventSummary";
import type { EventEnriched } from "@/content";
import { groupEventsByYearAndUpcoming } from "@/utils/eventGrouping";

import { useEventsFilter } from "./EventsFilterProvider";

interface Props {
  events: EventEnriched[];
}

export default function EventsGridView({ events }: Props) {
  const { currentFilters } = useEventsFilter();
  const eventGroups = groupEventsByYearAndUpcoming(events, currentFilters.sort);

  return (
    <div data-testid="events-grid-view">
      {eventGroups.map((group) => (
        <Section key={group.label} grid wide title={group.label} className="pb-6">
          {group.events.map((event) => (
            <div key={event.id} data-testid="event-card">
              <EventSummary event={event} />
            </div>
          ))}
        </Section>
      ))}
    </div>
  );
}
