import EventsSearchInput from "./EventsSearchInput";
import EventsFilterDropdown from "./EventsFilterDropdown";
import EventsSortSelector from "./EventsSortSelector";
import EventsActiveFilters from "./EventsActiveFilters";
import { EventsViewModeSelector } from "./EventsViewModeSelector";

interface EventsFilterProps {
  availableFilters: {
    topics: string[];
    locations: string[];
  };
  currentView: "grid" | "compact" | "gallery";
}

export function EventsFilter({ availableFilters, currentView }: EventsFilterProps) {
  return (
    <div className="sticky top-0 z-40 bg-base-100 border-b border-base-200 py-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <EventsSearchInput />
        </div>

        <div className="flex flex-wrap gap-2">
          {availableFilters.topics.length > 0 && (
            <EventsFilterDropdown
              id="topics"
              label="Topics"
              options={availableFilters.topics}
              multiple={true}
              data-testid="topics-filter-dropdown"
            />
          )}

          {availableFilters.locations.length > 0 && (
            <EventsFilterDropdown
              id="location"
              label="Location"
              options={availableFilters.locations}
              multiple={false}
              data-testid="location-filter-dropdown"
            />
          )}
        </div>

        <EventsSortSelector data-testid="sort-selector" />

        <EventsViewModeSelector currentView={currentView} />
      </div>

      <EventsActiveFilters />
    </div>
  );
}
