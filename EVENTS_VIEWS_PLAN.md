# Events Page Migration Plan: Astro to React

## Goal

Convert the Events page from Astro's hybrid SSR/client approach to a fully React-based implementation. This migration should be executable by an agent in a single pass without human intervention.

## Architecture

- **Astro page**: Only fetches events and passes to React
- **React components**: Handle all filtering, URL parsing, and state management
- **URL patterns preserved**: `/events`, `/events/compact`, `/events/gallery`
- **All tests in one file**: `test/e2e/event-filters.spec.ts`

## Implementation Steps

Before starting, please make yourself familiar with the relevant parts of our codebase.

### Phase 0: Create Failing E2E Tests

**File:** `test/e2e/event-filters.spec.ts`

Write all tests that will verify:

- Search functionality
- Topic filtering (single and multiple)
- Location filtering
- Sort options (date-asc, date-desc)
- Combined filters
- URL parameter persistence
- View mode switching (grid, compact, gallery)
- Browser back/forward navigation
- No flash of unfiltered content with URL params

Run `npm run test` to confirm tests fail, then proceed with implementation.

### Phase 1: Core React Components

1. **Create `src/components/Events/EventsPage.tsx`**

   ```typescript
   import type { EventWithVenue } from "@/data";

   interface Props {
     events: EventWithVenue[];
     view: "grid" | "compact" | "gallery";
   }

   export default function EventsPage({ events, view }: Props) {
     // View mode comes from Astro route
     // Wrap with EventsFilterProvider
   }
   ```

2. **Update `src/components/EventsFilter/EventsFilterProvider.tsx`**
   - Remove all DOM manipulation
   - Read filters from URL on mount
   - Initialize Fuse.js
   - Update URL on filter changes

3. **Create `src/components/Events/EventsContainer.tsx`**
   - Render different views based on view prop passed down
   - Use filtered events from context

### Phase 2: View Components

1. **Create view components:**
   - `src/components/Events/EventsGridView.tsx` (from EventsViewGrid.astro)
   - `src/components/Events/EventsCompactView.tsx` (from EventsViewCompact.astro)
   - `src/components/Events/EventsGalleryView.tsx` (from EventsViewGallery.astro)

2. **Update `src/pages/events/[...eventsView].astro`:**

   ```astro
   ---
   import PageLayout from "@/layouts/PageLayout.astro";
   import EventsPage from "@/components/Events/EventsPage";
   import { getEvents } from "@/data";

   const { eventsView } = Astro.params;
   const view = eventsView || "grid";

   const events = await getEvents();

   export async function getStaticPaths() {
     return [
       { params: { eventsView: undefined } },
       { params: { eventsView: "compact" } },
       { params: { eventsView: "gallery" } },
     ];
   }
   ---

   <PageLayout title="Events">
     <EventsPage events={events} view={view} client:load />
   </PageLayout>
   ```

### Phase 3: Cleanup

1. **Delete obsolete files:**
   - `src/components/Events/EventsView.astro`
   - `src/components/EventsFilter/EventsFilterBridge.tsx`
   - `src/components/EventsFilter/EventsFilterWrapper.tsx`
   - `src/components/Events/EventsViewGrid.astro`
   - `src/components/Events/EventsViewCompact.astro`
   - `src/components/Events/EventsViewGallery.astro`

2. **Update filter components:**
   - Remove DOM manipulation from `EventsFilter.tsx`
   - Add debouncing to `EventsSearchInput.tsx`

### Phase 4: Final Verification

1. Run `npm run checks` to ensure no type errors
2. Run `npm run test` - all tests should pass
3. If flash of unfiltered content occurs with URL params, add minimal inline script

## Component Hierarchy

```
/events/[view] (Astro Page - only passes events array)
  └── EventsPage (React - reads URL, manages all state)
      └── EventsFilterProvider (reads filters from URL on mount)
          ├── EventsFilter
          │   ├── EventsSearchInput
          │   ├── EventsFilterDropdown (Topics)
          │   ├── EventsFilterDropdown (Location)
          │   ├── EventsSortSelector
          │   └── EventsViewModeSelector
          ├── EventsActiveFilters
          └── EventsContainer
              ├── EventsGridView
              │   └── EventSummary (multiple)
              ├── EventsCompactView
              │   └── EventCompact (multiple)
              └── EventsGalleryView
                  └── EventFeatured (multiple)
```

## Key Implementation Notes

- All tests go in `test/e2e/event-filters.spec.ts`
- Follow existing component patterns (default exports, Props interface)
- Use `EventWithVenue` type from `@/data`
- View mode comes from Astro route params, NOT from parsing pathname
- Filters/search params are read from URL search params in React
- Astro page is minimal - just fetches events and passes view mode
- React handles URL search params parsing and state management
- Run `npm run checks` and `npm run test` frequently
- This migration should be completable in a single agent run without human intervention
