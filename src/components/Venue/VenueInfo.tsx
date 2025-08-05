import { LuBuilding, LuGlobe, LuMapPin } from "react-icons/lu";

import CityBadge from "@/components/Common/CityBadge";
import type { VenueEnriched } from "@/content";

import VenueMap from "./VenueMap";

interface Props {
  venue: VenueEnriched;
}

export default function VenueInfo({ venue }: Props) {
  return (
    <div className="bg-base-100 overflow-hidden rounded-lg">
      {/* Venue Information Section */}
      <div className="space-y-4 p-6">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex-shrink-0">
            <LuMapPin className="text-primary h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base-content text-lg font-semibold">{venue.data.title}</span>
            {venue.data.address && (
              <span className="text-base-content/70 mt-1">{venue.data.address}</span>
            )}
          </div>
        </div>

        {venue.data.city && (
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0">
              <LuBuilding className="text-primary h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base-content text-lg font-semibold capitalize">
                {venue.data.city}, Japan
              </span>
            </div>
          </div>
        )}

        {venue.data.url && (
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0">
              <LuGlobe className="text-primary h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <a
                href={venue.data.url}
                target="_blank"
                className="text-base-content hover:text-primary text-lg font-semibold transition-colors"
              >
                {venue.data.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="relative aspect-video w-full lg:aspect-square">
        <VenueMap venue={venue.data} marker={venue.data.title} link={true} />
        {venue.data.city && (
          <div className="absolute right-2 bottom-2">
            <CityBadge city={venue.data.city} />
          </div>
        )}
      </div>
    </div>
  );
}
