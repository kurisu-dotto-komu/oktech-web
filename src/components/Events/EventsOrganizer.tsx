import type { EventEnriched } from "@/content";
import { EventFilterProvider } from "@/components/Events/EventsFilterProvider";
import { EventsFilter } from "@/components/Events/EventsFilter";
import EventsContainer from "./EventsContainer";
import { useEventsFilter } from "@/components/Events/EventsFilterProvider";

export type EventsOrganizerViews = "grid" | "compact" | "gallery";

function EventsOrganizerInner({
  events,
  view,
}: {
  events: EventEnriched[];
  view: EventsOrganizerViews;
}) {
  const { availableFilters } = useEventsFilter();

  return (
    <>
      <EventsFilter availableFilters={availableFilters} currentView={view} />
      <EventsContainer events={events} view={view} />
    </>
  );
}

export default function EventsOrganizer({
  events,
  view,
}: {
  events: EventEnriched[];
  view: EventsOrganizerViews;
}) {
  return (
    <EventFilterProvider events={events}>
      <EventsOrganizerInner events={events} view={view} />
    </EventFilterProvider>
  );
}
