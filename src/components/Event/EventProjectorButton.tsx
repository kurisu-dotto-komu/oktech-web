import { useState } from "react";
import { LuProjector } from "react-icons/lu";
import type { EventWithVenue } from "@/data";
import EventProjectorOverlay from "./EventProjectorOverlay";

interface EventProjectorButtonProps {
  event: EventWithVenue;
}

export default function EventProjectorButton({ event }: EventProjectorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-outline btn-primary"
        aria-label="Open projector view"
      >
        <LuProjector className="w-4 h-4" />
        Projector View
      </button>
      <EventProjectorOverlay event={event} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
