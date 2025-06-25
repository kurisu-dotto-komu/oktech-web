import { EventFilterProvider } from "./EventsFilterProvider";
import { EventsSearchInput } from "./EventsSearchInput";
import { EventsFilterDropdown } from "./EventsFilterDropdown";
import { EventsSortSelector } from "./EventsSortSelector";
import { EventsActiveFilters } from "./EventsActiveFilters";
import { EventsViewModeSelector } from "./EventsViewModeSelector";

interface EventsFilterProps {
  items: any[];
  availableFilters: {
    topics: string[];
    locations: string[];
  };
  sortOptions: Array<{ value: string; label: string }>;
  currentView?: string;
  initialFilters?: any;
  onFiltersChange?: (filters: any, filteredItems: any[]) => void;
}

export const EventsFilter: React.FC<EventsFilterProps> = ({
  items,
  availableFilters,
  sortOptions,
  currentView = "grid",
  initialFilters,
  onFiltersChange,
}) => {
  return (
    <EventFilterProvider
      items={items}
      availableFilters={availableFilters}
      sortOptions={sortOptions}
      initialFilters={initialFilters}
      onFiltersChange={onFiltersChange}
    >
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
              />
            )}

            {availableFilters.locations.length > 0 && (
              <EventsFilterDropdown
                id="location"
                label="Location"
                options={availableFilters.locations}
                multiple={false}
              />
            )}
          </div>

          <EventsSortSelector />

          <EventsViewModeSelector currentView={currentView} />
        </div>

        <EventsActiveFilters />
      </div>
    </EventFilterProvider>
  );
};
