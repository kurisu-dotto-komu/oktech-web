import { useEventsFilter } from "./EventsFilterProvider";

interface Props {
  "data-testid"?: string;
}

export default function EventsSortSelector({ "data-testid": dataTestId }: Props = {}) {
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
        data-testid={dataTestId}
      >
        {sortOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            data-testid={`sort-option-${option.value}`}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
