import { useRef } from "react";
import { EventsFilter } from "./EventsFilter";
import type { EventItem, EventFilters } from "./EventsFilterProvider";

interface EventsFilterBridgeProps {
  items: EventItem[];
  availableFilters: {
    topics: string[];
    locations: string[];
  };
  sortOptions: Array<{ value: string; label: string }>;
  currentView?: string;
  initialFilters?: EventFilters;
  useClientUrlParams?: boolean; // Flag to use client-side URL params
}

export default function EventsFilterBridge(props: EventsFilterBridgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFiltersChange = (filters: EventFilters, filteredItems: EventItem[]) => {
    if (!containerRef.current) return;

    const container = document.getElementById("collection-container");
    if (container) {
      container.dataset.filteredItems = JSON.stringify(filteredItems);

      container.dispatchEvent(
        new CustomEvent("items-filtered", {
          detail: { items: filteredItems, filters },
        }),
      );

      // Defer DOM intensive updates to the next animation frame for smoother UI
      window.requestAnimationFrame(() => {
        updateVisibleItems(filteredItems);
      });
    }

    const countElement = document.getElementById("filtered-count");
    if (countElement) {
      countElement.textContent = `${filteredItems.length} events`;
    }
  };

  const updateVisibleItems = (filtered: EventItem[]) => {
    const filteredIds = new Set(filtered.map((item) => item.id));

    const itemElements: NodeListOf<HTMLElement> = document.querySelectorAll(
      "[data-item-id]",
    );
    const itemsMap = new Map<string, HTMLElement>();

    itemElements.forEach((element) => {
      const itemId = element.getAttribute("data-item-id");
      if (itemId) {
        itemsMap.set(itemId, element);

        // Smooth fade
        const shouldShow = filteredIds.has(itemId);

        if (shouldShow) {
          // Prepare element for showing
          element.classList.remove("pointer-events-none", "opacity-0", "hidden");

          // Force reflow so transition runs
          void element.offsetWidth; // eslint-disable-line @typescript-eslint/no-unused-expressions
        } else {
          // Fade out first
          element.classList.add("opacity-0", "pointer-events-none");
          // After transition ends, ensure it's hidden to skip in layout calculations
          setTimeout(() => {
            element.classList.add("hidden");
          }, 200);
        }
      }
    });

    if (filtered.length > 0 && itemElements.length > 0) {
      const parent = itemElements[0].parentElement;
      if (parent) {
        const fragment = document.createDocumentFragment();

        filtered.forEach((item) => {
          const element = itemsMap.get(item.id);
          if (element) {
            fragment.appendChild(element);
          }
        });

        itemElements.forEach((element) => {
          if (element.classList.contains("hidden")) {
            fragment.appendChild(element);
          }
        });

        parent.appendChild(fragment);
      }
    }
  };

  return (
    <div ref={containerRef}>
      <EventsFilter {...props} onFiltersChange={handleFiltersChange} />
    </div>
  );
}
