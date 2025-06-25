import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import Fuse from "fuse.js";

interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  topics?: string[];
  location?: string;
  venue?: any;
  poster?: string;
  slug: string;
}

interface EventFilters {
  search: string;
  topics: string[];
  location: string;
  sort: "date-desc" | "date-asc";
}

interface EventFilterContextType {
  items: EventItem[];
  currentFilters: EventFilters;
  availableFilters: {
    topics: string[];
    locations: string[];
  };
  sortOptions: Array<{ value: string; label: string }>;
  filteredItems: EventItem[];
  updateFilter: (filterType: keyof EventFilters, value: any) => void;
  clearFilter: (filterType: keyof EventFilters) => void;
  clearAllFilters: () => void;
  removeFilterValue: (filterType: string, value: string) => void;
}

const EventFilterContext = createContext<EventFilterContextType | undefined>(undefined);

export const useEventsFilter = () => {
  const context = useContext(EventFilterContext);
  if (!context) {
    throw new Error("useEventsFilter must be used within EventFilterProvider");
  }
  return context;
};

interface EventFilterProviderProps {
  children: React.ReactNode;
  items: EventItem[];
  availableFilters: {
    topics: string[];
    locations: string[];
  };
  sortOptions: Array<{ value: string; label: string }>;
  initialFilters?: EventFilters;
  onFiltersChange?: (filters: EventFilters, filteredItems: EventItem[]) => void;
}

export const EventFilterProvider: React.FC<EventFilterProviderProps> = ({
  children,
  items,
  availableFilters,
  sortOptions,
  initialFilters,
  onFiltersChange,
}) => {
  const [currentFilters, setCurrentFilters] = useState<EventFilters>(() => {
    if (typeof window !== "undefined") {
      console.log("[EventsFilterProvider] Initial URL:", window.location.href);
      console.log("[EventsFilterProvider] Initial search params:", window.location.search);
    }
    if (initialFilters) {
      console.log("[EventsFilterProvider] Using initialFilters:", initialFilters);
      return initialFilters;
    }

    // Only parse URL params on client side
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const filters = {
        search: urlParams.get("search") || "",
        topics: urlParams.get("topics")?.split(",").filter(Boolean) || [],
        location: urlParams.get("location") || "",
        sort: (urlParams.get("sort") as "date-desc" | "date-asc") || "date-desc",
      };
      console.log("[EventsFilterProvider] Parsed filters from URL:", filters);
      return filters;
    }

    // Default filters for SSR
    return {
      search: "",
      topics: [],
      location: "",
      sort: "date-desc",
    };
  });

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: ["title", "description", "topics", "location"],
      threshold: 0.3,
      includeScore: true,
    });
  }, [items]);

  const sortItems = useCallback(
    (itemsToSort: EventItem[]): EventItem[] => {
      const sorted = [...itemsToSort];

      if (currentFilters.sort === "date-asc") {
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } else {
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    },
    [currentFilters.sort],
  );

  const getFilteredItems = useCallback((): EventItem[] => {
    let filtered = [...items];

    if (currentFilters.search) {
      const results = fuse.search(currentFilters.search);
      filtered = results.map((result) => result.item);
    }

    if (currentFilters.topics.length > 0) {
      filtered = filtered.filter((item) =>
        item.topics?.some((topic) => currentFilters.topics.includes(topic)),
      );
    }

    if (currentFilters.location) {
      filtered = filtered.filter(
        (item) => item.location?.toLowerCase() === currentFilters.location.toLowerCase(),
      );
    }

    return sortItems(filtered);
  }, [items, currentFilters, fuse, sortItems]);

  const filteredItems = useMemo(() => getFilteredItems(), [getFilteredItems]);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const updateURL = useCallback((filters: EventFilters) => {
    if (typeof window === "undefined") return; // Skip on SSR

    console.log("[updateURL] Called with filters:", filters);
    console.log("[updateURL] Current URL before update:", window.location.href);
    const url = new URL(window.location.href);

    // Clear only filter-related params, preserve others like 'view'
    url.searchParams.delete("search");
    url.searchParams.delete("topics");
    url.searchParams.delete("location");
    url.searchParams.delete("sort");

    if (filters.search) {
      url.searchParams.set("search", filters.search);
    }
    if (filters.topics.length > 0) {
      url.searchParams.set("topics", filters.topics.join(","));
    }
    if (filters.location) {
      url.searchParams.set("location", filters.location);
    }
    if (filters.sort !== "date-desc") {
      url.searchParams.set("sort", filters.sort);
    }

    console.log("[updateURL] New URL:", url.toString());
    window.history.pushState(filters, "", url.toString());
    // Don't dispatch popstate - it can cause unwanted side effects
  }, []);

  useEffect(() => {
    console.log(
      "[EventsFilterProvider useEffect] isInitialMount:",
      isInitialMount,
      "filters:",
      currentFilters,
    );
    if (onFiltersChange) {
      onFiltersChange(currentFilters, filteredItems);
    }
    // Skip URL update on initial mount to preserve existing params
    if (!isInitialMount) {
      updateURL(currentFilters);
    }
  }, [currentFilters, filteredItems, onFiltersChange, updateURL, isInitialMount]);

  useEffect(() => {
    console.log("[EventsFilterProvider] Setting isInitialMount to false");
    setIsInitialMount(false);
  }, []);

  const updateFilter = useCallback((filterType: keyof EventFilters, value: any) => {
    setCurrentFilters((prev) => {
      const newFilters = { ...prev };

      if (filterType === "search") {
        newFilters.search = value;
      } else if (filterType === "sort") {
        newFilters.sort = value;
      } else if (filterType === "topics") {
        if (Array.isArray(value)) {
          newFilters.topics = value;
        } else {
          if (newFilters.topics.includes(value)) {
            newFilters.topics = newFilters.topics.filter((t) => t !== value);
          } else {
            newFilters.topics = [...newFilters.topics, value];
          }
        }
      } else if (filterType === "location") {
        newFilters.location = value;
      }

      return newFilters;
    });
  }, []);

  const clearFilter = useCallback((filterType: keyof EventFilters) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [filterType]: filterType === "topics" ? [] : filterType === "sort" ? "date-desc" : "",
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setCurrentFilters({
      search: "",
      topics: [],
      location: "",
      sort: "date-desc",
    });
  }, []);

  const removeFilterValue = useCallback((filterType: string, value: string) => {
    setCurrentFilters((prev) => {
      const newFilters = { ...prev };

      if (filterType === "search") {
        newFilters.search = "";
      } else if (filterType === "topic") {
        newFilters.topics = newFilters.topics.filter((t) => t !== value);
      } else if (filterType === "location") {
        newFilters.location = "";
      }

      return newFilters;
    });
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state) {
        setCurrentFilters(e.state);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const value: EventFilterContextType = {
    items,
    currentFilters,
    availableFilters,
    sortOptions,
    filteredItems,
    updateFilter,
    clearFilter,
    clearAllFilters,
    removeFilterValue,
  };

  return <EventFilterContext.Provider value={value}>{children}</EventFilterContext.Provider>;
};
