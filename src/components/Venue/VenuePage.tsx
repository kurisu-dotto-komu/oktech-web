import VenueInfo from "./VenueInfo";
import VenueNav from "./VenueNav";
import Section from "@/components/Common/Section";
import type { CollectionEntry } from "astro:content";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  venue: CollectionEntry<"venues">;
  venues: CollectionEntry<"venues">[];
  venueEvents: CollectionEntry<"events">[];
  children?: ReactNode;
}

export default function VenuePage({ venue, venues, venueEvents, children }: Props) {
  return (
    <>
      <Section>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex flex-col gap-10 flex-1">
            {venue.data.cover && (
              <figure className="rounded-xl aspect-video w-full bg-white shadow-xl overflow-hidden">
                <img
                  src={venue.data.cover.src}
                  alt={`${venue.data.title} cover`}
                  className="w-full h-full object-contain p-8"
                  width={512}
                  height={512}
                />
              </figure>
            )}

            <h1 className="text-4xl font-bold pt-6">{venue.data.title}</h1>

            {venue.data.markdownContent && (
              <div className="max-w-none prose prose-lg">
                <ReactMarkdown>{venue.data.markdownContent}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className="lg:w-80">
            <div className="lg:sticky lg:top-20">
              <div className="card bg-base-100 shadow-lg rounded-lg overflow-hidden">
                <div className="card-body p-0">
                  <VenueInfo venue={venue} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {venueEvents.length > 0 && (
        <Section>
          <h2 className="text-2xl font-bold mb-8">Events Hosted at {venue.data.title}</h2>
          <div className="flex flex-col gap-8">
            {/* EventFeatured components will be rendered by parent */}
            {children}
          </div>
        </Section>
      )}

      <Section>
        <VenueNav venue={venue} venues={venues} className="venue-navigation" />
      </Section>
    </>
  );
}
