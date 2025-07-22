import EventsFilterBridge from "./EventsFilterBridge";
import type { EventItem } from "./EventsFilterProvider";

export interface Props {
  items: EventItem[];
  currentFilters: {
    search: string;
    topics?: string[];
    location?: string;
    sort: string;
    view: string;
  };
  availableFilters: {
    topics: string[];
    locations: string[];
  };
  sortOptions: Array<{ value: string; label: string }>;
}

export default function EventsFilterWrapper({
  items,
  currentFilters,
  availableFilters,
  sortOptions,
}: Props) {
  return (
    <EventsFilterBridge
      items={items}
      availableFilters={availableFilters}
      sortOptions={sortOptions}
      currentView={currentFilters.view}
    />
  );
}
