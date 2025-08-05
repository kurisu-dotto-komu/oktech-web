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

  switch (view) {
    case "compact":
      return <EventsViewCompact events={sortedEvents} />;
    case "gallery":
      return <EventsViewGallery events={sortedEvents} />;
    case "grid":
    default:
      return <EventsViewGrid events={sortedEvents} />;
  }
}
