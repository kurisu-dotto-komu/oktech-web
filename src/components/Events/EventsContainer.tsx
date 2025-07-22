import type { EventWithVenue } from "@/data";
import type { CollectionEntry } from "astro:content";
import { useEventsFilter } from "@/components/EventsFilter/EventsFilterProvider";
import EventsGridView from "./EventsGridView";
import EventsCompactView from "./EventsCompactView";
import EventsGalleryView from "./EventsGalleryView";

interface Props {
  events: EventWithVenue[];
  view: "grid" | "compact" | "gallery";
  galleryImages?: CollectionEntry<"eventGalleryImage">[];
}

export default function EventsContainer({ events, view, galleryImages = [] }: Props) {
  const { filteredItems } = useEventsFilter();

  // Create a map of filtered event IDs for quick lookup
  const filteredIds = new Set(filteredItems.map((item) => item.id));

  // Filter the full event objects based on filtered IDs
  const filteredEvents = events.filter((event) => filteredIds.has(event.id));

  // Sort the filtered events to match the order from filteredItems
  const sortedEvents = filteredItems
    .map((item) => filteredEvents.find((event) => event.id === item.id))
    .filter((event): event is EventWithVenue => event !== undefined);

  switch (view) {
    case "compact":
      return <EventsCompactView events={sortedEvents} />;
    case "gallery":
      return <EventsGalleryView events={sortedEvents} galleryImages={galleryImages} />;
    case "grid":
    default:
      return <EventsGridView events={sortedEvents} />;
  }
}
