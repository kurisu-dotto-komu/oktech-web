import EventsFilterDropdown from "./EventsFilterDropdown";
import { useEventsFilter } from "./EventsFilterProvider";
import type { EventsOrganizerViews } from "./EventsOrganizer";
import EventsSearchInput from "./EventsSearchInput";
import EventsSortSelector from "./EventsSortSelector";
import { EventsViewModeSelector } from "./EventsViewModeSelector";

interface EventsFilterProps {
  currentView: EventsOrganizerViews;
  availableFilters: {
    topics: string[];
    locations: string[];
  };
}

export function EventsFilter({ availableFilters, currentView }: EventsFilterProps) {
  const { currentFilters, clearAllFilters } = useEventsFilter();

  const hasActiveFilters =
    currentFilters.search || currentFilters.topics.length > 0 || currentFilters.location;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <EventsSearchInput />

          <div className="join">
            {availableFilters.locations.length > 0 && (
              <EventsFilterDropdown
                id="location"
                label="Location"
                options={availableFilters.locations}
                multiple={false}
                data-testid="location-filter-dropdown"
              />
            )}

            {availableFilters.topics.length > 0 && (
              <EventsFilterDropdown
                id="topics"
                label="Topics"
                options={availableFilters.topics}
                multiple={true}
                data-testid="topics-filter-dropdown"
              />
            )}

            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-secondary join-item"
                onClick={clearAllFilters}
                data-testid="clear-all-filters"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <EventsSortSelector data-testid="sort-selector" />
          <EventsViewModeSelector currentView={currentView} />
        </div>
      </div>
    </div>
  );
}
