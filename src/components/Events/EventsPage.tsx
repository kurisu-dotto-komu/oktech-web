import type { EventEnriched } from "@/content";
import { EventFilterProvider } from "@/components/EventsFilter/EventsFilterProvider";
import { EventsFilter } from "@/components/EventsFilter/EventsFilter";
import EventsContainer from "./EventsContainer";
import Section from "@/components/Common/Section";

interface Props {
  events: EventEnriched[];
  view: "grid" | "compact" | "gallery";
}

export default function EventsPage({ events, view }: Props) {
  // Extract unique topics and locations for filters
  const allTopics = new Set<string>();
  const allLocations = new Set<string>();

  events.forEach((event) => {
    event.data.topics?.forEach((topic) => allTopics.add(topic));
    if (event.venue?.city) allLocations.add(event.venue.city);
  });

  // Prepare data for filtering
  const eventItems = events.map((event) => ({
    id: event.id,
    title: event.data.title,
    description: event.data.markdownContent,
    date: event.data.dateTime.toISOString(),
    topics: event.data.topics || [],
    location: event.venue?.city || "",
    venue: event.venue,
    poster: event.data.cover,
    slug: event.id,
    hasGallery: event.galleryImages && event.galleryImages.length > 0,
  }));

  const availableFilters = {
    topics: Array.from(allTopics).sort(),
    locations: Array.from(allLocations).sort(),
  };

  const sortOptions = [
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
  ];

  return (
    <>
      <Section className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Events</h1>
        <p className="text-lg text-base-content/70">Discover and join our community events</p>
      </Section>

      <div className="container mx-auto px-4">
        <EventFilterProvider
          items={eventItems}
          availableFilters={availableFilters}
          sortOptions={sortOptions}
        >
          <EventsFilter availableFilters={availableFilters} currentView={view} />
          <EventsContainer events={events} view={view} />
        </EventFilterProvider>
      </div>
    </>
  );
}
