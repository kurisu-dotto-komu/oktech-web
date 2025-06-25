import { useState, useEffect, useCallback } from "react";
import { useEventsFilter } from "./EventsFilterProvider";

export const EventsSearchInput: React.FC = () => {
  const { currentFilters, updateFilter, clearFilter } = useEventsFilter();
  const [localValue, setLocalValue] = useState(currentFilters.search);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalValue(currentFilters.search);
  }, [currentFilters.search]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        updateFilter("search", value);
      }, 300);

      setDebounceTimer(timer);
    },
    [debounceTimer, updateFilter],
  );

  const handleClear = useCallback(() => {
    setLocalValue("");
    clearFilter("search");
  }, [clearFilter]);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <div className="form-control">
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 opacity-70"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          className="grow"
          placeholder="Search events..."
          value={localValue}
          onChange={handleInputChange}
        />
        {localValue && (
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </label>
    </div>
  );
};
