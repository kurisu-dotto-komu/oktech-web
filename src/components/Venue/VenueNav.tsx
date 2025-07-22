import StickyBottomNavButtons from "@/components/Layout/StickyBottomNavButtons";
import type { CollectionEntry } from "astro:content";

interface Props {
  venue: CollectionEntry<"venues">;
  venues: CollectionEntry<"venues">[];
  className?: string;
  class?: string;
}

export default function VenueNav({ venue, venues, className, class: classFromAstro }: Props) {
  const finalClassName = className || classFromAstro || "";

  // Get current index and prev/next venues
  const currentIndex = venues.findIndex((v) => v.id === venue.id);
  const prevVenue = currentIndex > 0 ? venues[currentIndex - 1] : venues[venues.length - 1];
  const nextVenue = currentIndex < venues.length - 1 ? venues[currentIndex + 1] : venues[0];

  const prevItem = {
    href: `/venue/${prevVenue.id}`,
    title: prevVenue.data.title,
  };

  const nextItem = {
    href: `/venue/${nextVenue.id}`,
    title: nextVenue.data.title,
  };

  // No back button since there's no venues list page
  return (
    <StickyBottomNavButtons prevItem={prevItem} nextItem={nextItem} className={finalClassName} />
  );
}
