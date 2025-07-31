import EventsSearchInput from "./EventsSearchInput";
import EventsFilterDropdown from "./EventsFilterDropdown";
import EventsSortSelector from "./EventsSortSelector";
import { EventsViewModeSelector } from "./EventsViewModeSelector";
import EventsSubscribeDropdown from "./EventsSubscribeDropdown";
import type { EventsOrganizerViews } from "./EventsOrganizer";
import { useEventsFilter } from "./EventsFilterProvider";

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
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
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

        <div className="flex gap-2 items-center">
          <EventsSortSelector data-testid="sort-selector" />
          <EventsViewModeSelector currentView={currentView} />
          <EventsSubscribeDropdown />
        </div>
      </div>
    </div>
  );
}
