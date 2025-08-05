import { useEventsFilter } from "@/components/Events/EventsFilterProvider";
import type { EventEnriched } from "@/content";

import EventsViewCompact from "./EventsViewCompact";
import EventsViewGallery from "./EventsViewGallery";
import EventsViewGrid from "./EventsViewGrid";

interface Props {
  events: EventEnriched[];
  view: "grid" | "compact" | "gallery";
}

export default function EventsView({ events, view }: Props) {
  const { filteredItems } = useEventsFilter();

  // Create a map of filtered event IDs for quick lookup
  const filteredIds = new Set(filteredItems.map((item) => item.id));

  // Filter the full event objects based on filtered IDs
  const filteredEvents = events.filter((event) => filteredIds.has(event.id));

  // Sort the filtered events to match the order from filteredItems
  const sortedEvents = filteredItems
    .map((item) => filteredEvents.find((event) => event.id === item.id))
    .filter((event): event is EventEnriched => event !== undefined);

  return (
    <div className="my-12 flex flex-col gap-24">
      {view === "grid" && <EventsViewGrid events={sortedEvents} />}
      {view === "compact" && <EventsViewCompact events={sortedEvents} />}
      {view === "gallery" && <EventsViewGallery events={sortedEvents} />}
    </div>
  );
}
