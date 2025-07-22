# Astro to React Migration Checklist

This checklist tracks the migration status of all Astro components to React components.

## MANUAL REVIEW REQUIRED

| Converted | Cleaned up | Component Name                                | Problematic? Reason                                               |
| --------- | ---------- | --------------------------------------------- | ----------------------------------------------------------------- |
| ❌        | ❌         | src/components/Common/Sitemap.astro           | ❌ Yes - Full page component with layout                          |
| ❌        | ❌         | src/components/Events/EventsViewCompact.astro | ❌ Yes - Depends on EventCompact with async data fetching         |
| ❌        | ❌         | src/components/Events/EventsViewGrid.astro    | ❌ Yes - Depends on EventSummary with async data fetching         |
| ❌        | ❌         | src/components/Person/PersonAvatars.astro     | ❌ Yes - Uses async getPeople() data fetching                     |
| ❌        | ❌         | src/components/Person/PersonNav.astro         | ❌ Yes - Uses async resolvePerson() and getPeople() data fetching |
| ❌        | ❌         | src/components/Venue/VenueNav.astro           | ❌ Yes - Uses async resolveVenue() and getVenues() data fetching  |
| ❌        | ❌         | src/components/Event/EventCompact.astro       | ❌ Yes - Async data fetching with resolveEvent(Astro)             |
| ❌        | ❌         | src/components/Event/EventDetails.astro       | ❌ Yes - Async data fetching and dynamic markdown import          |
| ❌        | ❌         | src/components/Event/EventFeatured.astro      | ❌ Yes - Async data fetching with resolveEvent(Astro)             |
| ❌        | ❌         | src/components/Event/EventGallery.astro       | ❌ Yes - Async data fetching and Astro content collections        |
| ❌        | ❌         | src/components/Event/EventGalleryImages.astro | ❌ Yes - Async data fetching and Astro content collections        |
| ❌        | ❌         | src/components/Event/EventInfo.astro          | ❌ Yes - Async data fetching with resolveEvent(Astro)             |
| ❌        | ❌         | src/components/Event/EventLinks.astro         | ❌ Yes - Async file system access and YAML parsing                |
| ❌        | ❌         | src/components/Event/EventNav.astro           | ❌ Yes - Multiple async data operations                           |
| ❌        | ❌         | src/components/Event/EventPage.astro          | ❌ Yes - Async data fetching with resolveEvent(Astro)             |
| ❌        | ❌         | src/components/Event/EventPeople.astro        | ❌ Yes - Multiple async data fetching with route params           |
| ❌        | ❌         | src/components/Event/EventProjector.astro     | ❌ Yes - Async data fetching with custom layout                   |
| ❌        | ❌         | src/components/Event/EventSummary.astro       | ❌ Yes - Async data fetching with resolveEvent(Astro)             |
| ❌        | ❌         | src/components/Events/EventsUpcoming.astro    | ❌ Yes - Async data fetching with getEvents()                     |
| ❌        | ❌         | src/components/Events/EventsView.astro        | ❌ Yes - Complex data fetching and inline scripts                 |
| ❌        | ❌         | src/components/Common/ThemePicker.astro       | ⚠️ Maybe - Uses dialog API with inline handlers                   |
| ❌        | ❌         | src/components/Events/EventsViewGallery.astro | ❌ Yes - Uses Astro content collections API                       |
| ❌        | ❌         | src/components/Landing/Landing.astro          | ❌ Yes - Multiple async data fetching calls                       |
| ❌        | ❌         | src/components/Person/PersonDetails.astro     | ❌ Yes - Dynamic markdown imports                                 |
| ❌        | ❌         | src/components/Person/PersonPage.astro        | ❌ Yes - Complex data fetching and markdown imports               |
| ❌        | ❌         | src/components/Venue/VenueInfo.astro          | ❌ Yes - Async data fetching with resolveVenue()                  |
| ❌        | ❌         | src/components/Venue/VenueMap.astro           | ❌ Yes - Async data fetching and dynamic image imports            |
| ❌        | ❌         | src/components/Venue/VenuePage.astro          | ❌ Yes - Complex data fetching and dynamic imports                |
| ❌        | ❌         | src/layouts/PageLayout.astro                  | ⚠️ Maybe - Layout component with slots                            |
| ❌        | ❌         | src/layouts/ProjectorLayout.astro             | ⚠️ Maybe - Layout component with slots                            |
| ❌        | ❌         | src/layouts/RootLayout.astro                  | ⚠️ Maybe - Layout with inline scripts and global CSS              |

## Summary

- **Successfully Migrated to React**: 9 components
  - Link (with Astro wrapper for slot support)
  - VenueMapImage (with Astro wrapper)
  - Footer (with Astro wrapper)
  - StickyBottomNavButton (with Astro wrapper)
  - StickyBottomNavButtons (with Astro wrapper)
  - StickyNavigation (with Astro wrapper)
  - EventsFilterWrapper (with Astro wrapper)
  - Section (with Astro wrapper)
  - DevInfo (fully integrated, no wrapper needed)
- **Remaining Components**: 33
  - **Definitely Problematic (❌ Yes)**: 26 components with async data fetching, pages, or Astro-specific features
  - **Safe to Convert (✅ No)**: 5 components that are simple presentational components
  - **Might Need Consideration (⚠️ Maybe)**: 2 components with moderate complexity

## Key Challenges

1. **Data Fetching**: Components that use `getEvents()`, `resolveEvent()`, or other async data fetching in frontmatter
2. **Page Components**: All files in `src/pages/` need special handling as they're route components
3. **Static Path Generation**: Pages using `getStaticPaths()` for dynamic routes
4. **Astro Context**: Components using `Astro.props`, `Astro.url`, `Astro.params`, `Astro.redirect()`
5. **Layout Components**: Using `<slot />` for content projection
6. **Inline Scripts**: Components with `is:inline` script directives

## Recommended Migration Order

1. Start with simple presentational components (Button, Container, Grid, etc.)
2. Move to more complex components without data fetching
3. Handle layout components
4. Finally tackle components with data fetching and page components
