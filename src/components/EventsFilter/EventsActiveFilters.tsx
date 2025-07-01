import { useEventsFilter } from "./EventsFilterProvider";

export default function EventsActiveFilters() {
  const { currentFilters, removeFilterValue, clearAllFilters } = useEventsFilter();

  const hasActiveFilters =
    currentFilters.search ||
    currentFilters.topics.length > 0 ||
    currentFilters.location ||
    currentFilters.sort !== "date-desc";

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div id="active-filters-container" className="mt-2">
      <div className="flex items-center gap-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {currentFilters.search && (
            <FilterBadge
              type="search"
              value={currentFilters.search}
              onRemove={() => removeFilterValue("search", currentFilters.search)}
            />
          )}

          {currentFilters.topics.map((topic) => (
            <FilterBadge
              key={`topic-${topic}`}
              type="topic"
              value={topic}
              onRemove={() => removeFilterValue("topic", topic)}
            />
          ))}

          {currentFilters.location && (
            <FilterBadge
              type="location"
              value={currentFilters.location}
              onRemove={() => removeFilterValue("location", currentFilters.location)}
            />
          )}
        </div>
        <button type="button" className="btn btn-sm btn-ghost" onClick={clearAllFilters}>
          Clear All
        </button>
      </div>
    </div>
  );
}

export interface FilterBadgeProps {
  type: string;
  value: string;
  onRemove: () => void;
}

function FilterBadge({ type, value, onRemove }: FilterBadgeProps) {
  return (
    <div className="badge badge-primary gap-1">
      <span>
        {type}: {value}
      </span>
      <button
        type="button"
        className="btn btn-ghost btn-xs p-0 h-4 w-4"
        onClick={onRemove}
        aria-label={`Remove ${type} filter: ${value}`}
      >
        ×
      </button>
    </div>
  );
}
