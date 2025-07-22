import VenueMapImage from "./VenueMapImage";
import type { CollectionEntry } from "astro:content";

interface Props {
  venue: CollectionEntry<"venues">;
  marker?: boolean | string;
  link?: boolean;
  className?: string;
  class?: string;
}

export default function VenueMap({
  venue,
  marker,
  link = false,
  className,
  class: classFromAstro,
}: Props) {
  const finalClassName = className || classFromAstro || "";

  // Generate map URL - use gmaps if available, otherwise create from address
  const getMapUrl = () => {
    // Show link if either showMarker is true or marker prop is provided
    if (marker === undefined) return null;

    if (venue.data.gmaps) {
      return venue.data.gmaps;
    }
    if (venue.data.coordinates?.lat && venue.data.coordinates?.lng) {
      return `https://www.google.com/maps/search/?api=1&query=${venue.data.coordinates.lat},${venue.data.coordinates.lng}`;
    }

    if (venue.data.address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.data.address)}`;
    }
    return null;
  };

  const mapUrl = getMapUrl();

  // Get map image from venue data - check if it's already an image object or a string
  const mapImage = venue.data.mapImage
    ? { 
        default: typeof venue.data.mapImage === 'string' 
          ? { src: venue.data.mapImage } 
          : venue.data.mapImage 
      }
    : null;

  if (mapUrl && link) {
    return (
      <div data-testid="venue-map">
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full h-full hover:opacity-90 transition-opacity cursor-pointer ${finalClassName}`}
        >
          <VenueMapImage mapImage={mapImage} marker={marker} />
        </a>
      </div>
    );
  }

  return (
    <div data-testid="venue-map">
      <VenueMapImage mapImage={mapImage} marker={marker} className={finalClassName} />
    </div>
  );
}
