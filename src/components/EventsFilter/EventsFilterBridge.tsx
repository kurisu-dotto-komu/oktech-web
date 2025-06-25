import { useEffect, useRef } from "react";
import { EventsFilter } from "./EventsFilter";

interface EventsFilterBridgeProps {
  items: any[];
  availableFilters: {
    topics: string[];
    locations: string[];
  };
  sortOptions: Array<{ value: string; label: string }>;
  currentView?: string;
  initialFilters?: any;
  useClientUrlParams?: boolean; // Flag to use client-side URL params
}

export default function EventsFilterBridge(props: EventsFilterBridgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFiltersChange = (filters: any, filteredItems: any[]) => {
    if (!containerRef.current) return;

    const container = document.getElementById("collection-container");
    if (container) {
      container.dataset.filteredItems = JSON.stringify(filteredItems);

      container.dispatchEvent(
        new CustomEvent("items-filtered", {
          detail: { items: filteredItems, filters },
        }),
      );

      updateVisibleItems(filteredItems);
    }

    const countElement = document.getElementById("filtered-count");
    if (countElement) {
      countElement.textContent = `${filteredItems.length} events`;
    }
  };

  const updateVisibleItems = (filtered: any[]) => {
    const filteredIds = new Set(filtered.map((item) => item.id));

    const itemElements = document.querySelectorAll("[data-item-id]");
    const itemsMap = new Map<string, Element>();

    itemElements.forEach((element) => {
      const itemId = element.getAttribute("data-item-id");
      if (itemId) {
        itemsMap.set(itemId, element);
        if (filteredIds.has(itemId)) {
          element.classList.remove("hidden");
        } else {
          element.classList.add("hidden");
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
