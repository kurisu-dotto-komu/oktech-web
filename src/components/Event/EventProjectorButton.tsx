import { useState } from "react";

import { LuProjector } from "react-icons/lu";

import TooltipButton from "@/components/Common/TooltipButton";
import type { EventEnriched } from "@/content";

import EventProjectorOverlay from "./EventProjectorOverlay";

interface EventProjectorButtonProps {
  event: EventEnriched;
}

export default function EventProjectorButton({ event }: EventProjectorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TooltipButton
        onClick={() => setIsOpen(true)}
        className="btn btn-ghost opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Open projector view"
        tooltip="Projector view"
        tooltipPosition="top"
        data-testid="projector-view-button"
      >
        <LuProjector className="h-5 w-5" />
      </TooltipButton>
      <EventProjectorOverlay event={event} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
