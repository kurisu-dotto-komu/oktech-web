import EventSummary from "@/components/Event/EventSummary";
import type { EventEnriched } from "@/content";
import { filterRecentEvents } from "@/utils/eventFilters";
import clsx from "clsx";

interface EventsRecentProps {
  events: EventEnriched[];
  limit?: number;
}

export default function EventsRecent({ events, limit = 6 }: EventsRecentProps) {
  const recentEvents = filterRecentEvents(events).slice(0, limit);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {recentEvents.map((event, index) => (
        <div
          key={event.id}
          data-testid="event-card"
          className={clsx([
            index === 3 && "hidden sm:block",
            index === 4 && "hidden lg:block xl:hidden",
            index === 5 && "hidden lg:block xl:hidden ",
          ])}
        >
          <EventSummary event={event} />
        </div>
      ))}
    </div>
  );
}
