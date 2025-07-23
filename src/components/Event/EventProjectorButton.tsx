import { useState } from "react";
import { LuProjector } from "react-icons/lu";
import type { EventEnriched } from "@/content";
import EventProjectorOverlay from "./EventProjectorOverlay";

interface EventProjectorButtonProps {
  event: EventEnriched;
}

export default function EventProjectorButton({ event }: EventProjectorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-outline btn-primary"
        aria-label="Open projector view"
        data-testid="projector-view-button"
      >
        <LuProjector className="w-4 h-4" />
        Projector View
      </button>
      <EventProjectorOverlay event={event} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
