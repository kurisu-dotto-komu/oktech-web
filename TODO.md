# CHRIS FINAL MEGA SPRINT CRUNCH DAILY GRIND SCHEDULE

TARGET SOFT LAUNCH AUG 09.

## Schedule

### 5 Tuesday (UI + Theme)

- Refactor Section (KISS)
- Daisy UI borders
- Most elements inherit Diasy UI theme (e.g. borders, etc.)
- OG Image Styling
- Clean up all UI elements (events page w/ mobile)
- Mobile responsive design
- Kitcehn sink + theme editor

Visual Checks

| Route              | Mobile | Desktop |
| ------------------ | ------ | ------- |
| / (index)          | X      | X       |
| /events            | X      | X       |
| /event/[eventSlug] | X      | X       |
| /venue/[venueSlug] | X      | X       |
| /about             | X      | X       |

### 6 Wednesday (Review + Bugfixes)

- Event page fade if filter selected.
- Make sure images are optimized everywhere
- Resume github pages workflow with sync script trigger.

**Wednesday Afternoon: UI Review**

### 7 Thursday (Cleanup)

- Check why 'skeleton' isn't searching.
- Chekcs on multiple browsers and devices.
- Clean up codebase, removing AI stuff.

### 8 Friday

- Buffer Day

### 9 SOFT RELEASE DAY (oktech.jp/chris-wireframe)

- Work with Martin or whoever controls domains to do manual release
- Test automated builds

### Deprecate Section

- [src/components/Events/EventsViewCompact.tsx](src/components/Events/EventsViewCompact.tsx)
- [src/components/Events/EventsViewGrid.tsx](src/components/Events/EventsViewGrid.tsx)
- [src/components/Event/EventLinks.tsx](src/components/Event/EventLinks.tsx)
- [src/components/Event/EventGallery.tsx](src/components/Event/EventGallery.tsx)
- [src/pages/index.astro](src/pages/index.astro)
- [src/pages/venue/[venueSlug].astro](src/pages/venue/[venueSlug].astro)
- [src/pages/about.astro](src/pages/about.astro)
- [src/pages/event/[eventSlug].astro](src/pages/event/[eventSlug].astro)

# Post Release Features

- Feed modal, instead of direct link
- Members: with hasPage: true.
- Scripts for LLM decoration ?
- https://docs.astro.build/en/guides/view-transitions/
