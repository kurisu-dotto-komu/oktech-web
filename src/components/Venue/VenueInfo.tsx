import { LuMapPin, LuBuilding, LuGlobe } from "react-icons/lu";
import EventCity from "@/components/Event/EventCity";
import VenueMap from "./VenueMap";
import type { CollectionEntry } from "astro:content";

interface Props {
  venue: CollectionEntry<"venues">;
}

export default function VenueInfo({ venue }: Props) {
  return (
    <div className="bg-base-100 rounded-lg overflow-hidden">
      {/* Venue Information Section */}
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <LuMapPin className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-base-content">{venue.data.title}</span>
            {venue.data.address && (
              <span className="text-base-content/70 mt-1">{venue.data.address}</span>
            )}
          </div>
        </div>

        {venue.data.city && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <LuBuilding className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-base-content capitalize">
                {venue.data.city}, Japan
              </span>
            </div>
          </div>
        )}

        {venue.data.url && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <LuGlobe className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <a
                href={venue.data.url}
                target="_blank"
                className="text-lg font-semibold text-base-content hover:text-primary transition-colors"
              >
                {venue.data.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="w-full aspect-video lg:aspect-square relative">
        <VenueMap venue={venue} marker={venue.data.title} link={true} />
        {venue.data.city && (
          <div className="absolute bottom-2 right-2">
            <EventCity city={venue.data.city} />
          </div>
        )}
      </div>
    </div>
  );
}
