import { useEventsFilter } from "./EventsFilterProvider";
import { LuArrowDownWideNarrow, LuArrowUpWideNarrow } from "react-icons/lu";

interface Props {
  "data-testid"?: string;
}

export default function EventsSortSelector({ "data-testid": dataTestId }: Props = {}) {
  const { currentFilters, updateFilter } = useEventsFilter();

  const toggleSort = () => {
    const newSort = currentFilters.sort === "date-desc" ? "date-asc" : "date-desc";
    updateFilter("sort", newSort);
  };

  const isNewestFirst = currentFilters.sort === "date-desc";

  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={toggleSort}
      data-testid={dataTestId}
      aria-label={`Sort by ${isNewestFirst ? "oldest" : "newest"} first`}
      title={isNewestFirst ? "Newest First" : "Oldest First"}
    >
      <span className="hidden sm:inline">{isNewestFirst ? "Newest" : "Oldest"}</span>
      {isNewestFirst ? (
        <LuArrowDownWideNarrow className="w-4 h-4" />
      ) : (
        <LuArrowUpWideNarrow className="w-4 h-4" />
      )}
    </button>
  );
}
