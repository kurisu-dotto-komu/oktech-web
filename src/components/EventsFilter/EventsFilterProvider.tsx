import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import type Fuse from "fuse.js";
import type { Venue } from "@/data";
import type { ImageMetadata } from "astro";

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  topics?: string[];
  location?: string;
  venue?: Venue;
  poster?: ImageMetadata;
  slug: string;
}

export interface EventFilters {
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
  updateFilter: (filterType: keyof EventFilters, value: EventFilters[keyof EventFilters]) => void;
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
  children: ReactNode;
  items: EventItem[];
  availableFilters: {
    topics: string[];
    locations: string[];
  };
  sortOptions: Array<{ value: string; label: string }>;
  initialFilters?: EventFilters;
  onFiltersChange?: (filters: EventFilters, filteredItems: EventItem[]) => void;
}

export function EventFilterProvider({
  children,
  items,
  availableFilters,
  sortOptions,
  initialFilters,
  onFiltersChange,
}: EventFilterProviderProps) {
  const [currentFilters, setCurrentFilters] = useState<EventFilters>(() => {
    if (typeof window !== "undefined") {
      // Initial URL and search params
    }
    if (initialFilters) {
      // Using initialFilters
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
      // Parsed filters from URL
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

  const fuseRef = useRef<Fuse<EventItem> | null>(null);

  const initializeFuse = useCallback(async () => {
    if (!fuseRef.current) {
      const { default: Fuse } = await import("fuse.js");
      fuseRef.current = new Fuse(items, {
        keys: ["title", "description", "topics", "location"],
        threshold: 0.3,
        includeScore: true,
      });
    }
    return fuseRef.current;
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

  const getFilteredItems = useCallback(async (): Promise<EventItem[]> => {
    let filtered = [...items];

    if (currentFilters.search) {
      const fuse = await initializeFuse();
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
  }, [items, currentFilters, initializeFuse, sortItems]);

  const [filteredItems, setFilteredItems] = useState<EventItem[]>([]);

  useEffect(() => {
    const updateFilteredItems = async () => {
      const filtered = await getFilteredItems();
      setFilteredItems(filtered);
    };
    updateFilteredItems();
  }, [getFilteredItems]);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const updateURL = useCallback((filters: EventFilters) => {
    if (typeof window === "undefined") return; // Skip on SSR

    // Updating URL with filters
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

    // Updated URL
    window.history.pushState(filters, "", url.toString());
    // Don't dispatch popstate - it can cause unwanted side effects
  }, []);

  useEffect(() => {
    // Effect triggered for filter changes
    if (onFiltersChange) {
      onFiltersChange(currentFilters, filteredItems);
    }
    // Skip URL update on initial mount to preserve existing params
    if (!isInitialMount) {
      updateURL(currentFilters);
    }
  }, [currentFilters, filteredItems, onFiltersChange, updateURL, isInitialMount]);

  useEffect(() => {
    // Initial mount complete
    setIsInitialMount(false);
  }, []);

  const updateFilter = useCallback((filterType: keyof EventFilters, value: EventFilters[keyof EventFilters]) => {
    setCurrentFilters((prev) => {
      const newFilters = { ...prev };

      if (filterType === "search") {
        newFilters.search = value as string;
      } else if (filterType === "sort") {
        newFilters.sort = value as "date-desc" | "date-asc";
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
        newFilters.location = value as string;
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
}
