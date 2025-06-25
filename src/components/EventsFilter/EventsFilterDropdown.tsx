import { useRef, useEffect } from "react";
import { useEventsFilter } from "./EventsFilterProvider";

interface EventsFilterDropdownProps {
  id: "topics" | "location";
  label: string;
  options: string[];
  multiple?: boolean;
}

export const EventsFilterDropdown: React.FC<EventsFilterDropdownProps> = ({
  id,
  label,
  options,
  multiple = false,
}) => {
  const { currentFilters, updateFilter, clearFilter } = useEventsFilter();
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  const selected =
    id === "topics"
      ? currentFilters.topics
      : currentFilters.location
        ? [currentFilters.location]
        : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.open &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dropdownRef.current.open = false;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionChange = (option: string, checked: boolean) => {
    if (id === "topics") {
      updateFilter("topics", option);
    } else {
      updateFilter("location", checked ? option : "");
      // Close dropdown for single select
      if (dropdownRef.current && checked) {
        dropdownRef.current.open = false;
      }
    }
  };

  const handleClear = () => {
    clearFilter(id);
  };

  return (
    <details className="dropdown" ref={dropdownRef}>
      <summary className="btn btn-sm m-1">
        {label}
        {selected.length > 0 && (
          <span className="badge badge-primary badge-sm">{selected.length}</span>
        )}
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
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </summary>
      <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52 max-h-80 overflow-y-auto">
        {options.map((option) => (
          <li key={option}>
            <label className="label cursor-pointer justify-start gap-2">
              {multiple ? (
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary"
                  value={option}
                  checked={selected.includes(option)}
                  onChange={(e) => handleOptionChange(option, e.target.checked)}
                />
              ) : (
                <input
                  type="radio"
                  name={`filter-${id}`}
                  className="radio radio-sm radio-primary"
                  value={option}
                  checked={selected.includes(option)}
                  onChange={(e) => handleOptionChange(option, e.target.checked)}
                />
              )}
              <span className="label-text capitalize">{option}</span>
            </label>
          </li>
        ))}
        {selected.length > 0 && (
          <>
            <li>
              <hr className="my-1" />
            </li>
            <li>
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-block"
                onClick={handleClear}
              >
                Clear
              </button>
            </li>
          </>
        )}
      </ul>
    </details>
  );
};
