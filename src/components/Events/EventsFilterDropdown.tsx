import { useRef, useEffect } from "react";
import { useEventsFilter } from "./EventsFilterProvider";
import { LuChevronDown } from "react-icons/lu";

interface EventsFilterDropdownProps {
  id: "topics" | "location";
  label: string;
  options: string[];
  multiple?: boolean;
  "data-testid"?: string;
}

export default function EventsFilterDropdown({
  id,
  label,
  options,
  multiple = false,
  "data-testid": dataTestId,
}: EventsFilterDropdownProps) {
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

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getButtonLabel = () => {
    if (id === "location" && currentFilters.location) {
      return capitalizeFirst(currentFilters.location);
    }
    if (id === "topics" && currentFilters.topics.length > 0) {
      return `${label} (${currentFilters.topics.length})`;
    }
    return label;
  };

  return (
    <details className="dropdown" ref={dropdownRef} data-testid={dataTestId}>
      <summary
        className={`btn whitespace-nowrap join-item ${selected.length > 0 ? "btn-primary" : ""}`}
      >
        {getButtonLabel()}
        <LuChevronDown className="w-4 h-4" />
      </summary>
      <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52 max-h-80 overflow-y-auto">
        {options.map((option) => (
          <li key={option}>
            <label
              className="label cursor-pointer justify-start gap-2 "
              data-testid={`${id === "topics" ? "topic" : id}-option`}
            >
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
              <span className="label-text">
                {id === "location" ? capitalizeFirst(option) : option}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </details>
  );
}
