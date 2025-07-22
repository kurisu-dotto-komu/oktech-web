import type { EventWithVenue } from "@/data";
import type { CollectionEntry } from "astro:content";
import Section from "@/components/Common/Section";
import EventDetails from "./EventDetails";
import EventNav from "./EventNav";
import type { ReactNode } from "react";

interface Props {
  event: EventWithVenue;
  events: EventWithVenue[];
  venue?: CollectionEntry<"venues"> | null;
  children?: ReactNode;
}

export default function EventPage({ event, events, venue, children }: Props) {
  return (
    <>
      <Section>
        <EventDetails event={event} />
      </Section>
      {/* EventPeople, EventLinks, and EventGallery will be rendered by parent */}
      {children}
      <Section>
        <EventNav event={event} events={events} className="event-navigation" />
      </Section>
    </>
  );
}
