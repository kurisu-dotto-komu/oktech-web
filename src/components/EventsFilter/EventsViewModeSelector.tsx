import { useMemo } from "react";
import LinkReact from "@/components/Common/LinkReact";
import { useEventsFilter } from "./EventsFilterProvider";

interface EventsViewModeSelectorProps {
  currentView: string;
}

export function EventsViewModeSelector({ currentView }: EventsViewModeSelectorProps) {
  const { currentFilters } = useEventsFilter();

  const views = useMemo(() => {
    // Build query string from current filters
    const params = new URLSearchParams();

    if (currentFilters.search) {
      params.set("search", currentFilters.search);
    }
    if (currentFilters.topics.length > 0) {
      params.set("topics", currentFilters.topics.join(","));
    }
    if (currentFilters.location) {
      params.set("location", currentFilters.location);
    }
    if (currentFilters.sort !== "date-desc") {
      params.set("sort", currentFilters.sort);
    }

    const queryString = params.toString();
    const query = queryString ? `?${queryString}` : "";

    return [
      { value: "grid", label: "Grid", href: `/events${query}` },
      { value: "compact", label: "Compact", href: `/events/compact${query}` },
      { value: "gallery", label: "Gallery", href: `/events/gallery${query}` },
    ];
  }, [currentFilters]);

  return (
    <div className="flex gap-1">
      {views.map((view) => (
        <LinkReact
          key={view.value}
          href={view.href}
          className={`btn btn-sm ${currentView === view.value ? "btn-primary" : "btn-ghost"}`}
          data-view={view.value}
        >
          {view.label}
        </LinkReact>
      ))}
    </div>
  );
}
