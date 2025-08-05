import clsx from "clsx";

import CityBadge from "@/components/Common/CityBadge";
import type { ProcessedVenue } from "@/content";

import VenueMap from "../Venue/VenueMap";

export default function LocationCard({
  below,
  info,
  horizontal = false,
  children,
  venue,
}: {
  venue: ProcessedVenue;
  horizontal?: boolean;
  children: React.ReactNode;
  below?: React.ReactNode;
  info?: React.ReactNode;
}) {
  return (
    <>
      <div className={clsx("glass-card flex", horizontal ? "flex-row" : "flex-col")}>
        {venue && (
          <div className={clsx("relative flex", horizontal ? "h-60 w-60" : "h-full w-full")}>
            <VenueMap
              venue={venue}
              marker={venue?.title}
              link={true}
              className="absolute inset-0"
            />
            {venue.city && (
              <div className="absolute right-2 bottom-2">
                <CityBadge city={venue.city} />
              </div>
            )}
          </div>
        )}
        <div className="flex flex-grow flex-col">
          <div className="flex flex-grow flex-col justify-center gap-2 p-8">{children}</div>
          {info && (
            <div className="bg-primary/30 text-primary-content hidden px-8 py-4 text-sm md:block">
              {info}
            </div>
          )}
        </div>
      </div>
      {info && (
        <div className="bg-primary/30 text-primary-content rounded-box glass-border px-8 py-4 text-sm md:hidden">
          {info}
        </div>
      )}
      {below && (
        <div className={clsx("grid gap-6", horizontal ? "grid-cols-2" : "grid-cols-1")}>
          {below}
        </div>
      )}
    </>
  );
}
