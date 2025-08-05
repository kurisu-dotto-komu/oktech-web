import Section from "@/components/Common/Section";
import type { EventEnriched } from "@/content";
import { groupEventsByYearAndUpcoming } from "@/utils/eventGrouping";

import { EventCardList } from "../EventCard/EventCard";
import { useEventsFilter } from "./EventsFilterProvider";

interface Props {
  events: EventEnriched[];
}

export default function EventsCompactView({ events }: Props) {
  const { currentFilters } = useEventsFilter();
  const eventGroups = groupEventsByYearAndUpcoming(events, currentFilters.sort);

  return (
    <div>
      {eventGroups.map((group) => (
        <Section key={group.label} title={group.label}>
          <EventCardList events={group.events} />
        </Section>
      ))}
    </div>
  );
}
