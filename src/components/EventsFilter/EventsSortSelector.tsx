import React from "react";
import { useEventsFilter } from "./EventsFilterProvider";

export default function EventsSortSelector() {
  const { currentFilters, updateFilter, sortOptions } = useEventsFilter();

  const handleSortChange = (value: string) => {
    updateFilter("sort", value as "date-desc" | "date-asc");
  };

  return (
    <div className="form-control">
      <select
        className="select select-bordered select-sm"
        value={currentFilters.sort}
        onChange={(e) => handleSortChange(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
