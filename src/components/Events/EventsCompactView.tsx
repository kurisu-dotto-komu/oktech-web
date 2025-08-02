import clsx from "clsx";

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
          title={group.label}
          className="flex flex-col overflow-hidden rounded-lg pb-6"
        >
          <div className="border-base-100 overflow-hidden rounded-lg border">
            {group.events.map((event, index) => (
              <div key={event.id} data-testid="event-card">
                <EventCompact
                  event={event}
                  className={clsx(
                    "hover:bg-base-100",
                    index % 2 === 0 && "bg-base-100/30",
                    index % 2 === 1 && "bg-base-100/60",
                  )}
                />
              </div>
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
