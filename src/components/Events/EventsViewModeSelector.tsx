import { useMemo } from "react";
import LinkReact from "@/components/Common/LinkReact";
import { useEventsFilter } from "./EventsFilterProvider";
import { LuGrid3X3, LuList, LuImage } from "react-icons/lu";

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
      { value: "grid", label: "Grid", icon: LuGrid3X3, href: `/events${query}` },
      { value: "compact", label: "List", icon: LuList, href: `/events/compact${query}` },
      { value: "gallery", label: "Gallery", icon: LuImage, href: `/events/gallery${query}` },
    ];
  }, [currentFilters]);

  return (
    <div className="join">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <div key={view.value} className="tooltip" data-tip={view.label}>
            <LinkReact
              href={view.href}
              className={`join-item btn ${currentView === view.value ? "btn-primary" : ""}`}
              data-view={view.value}
              data-testid={`view-mode-${view.value}`}
              aria-label={view.label}
            >
              <Icon className="w-4 h-4" />
            </LinkReact>
          </div>
        );
      })}
    </div>
  );
}
