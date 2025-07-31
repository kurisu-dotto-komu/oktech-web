import { useState } from "react";
import { LuProjector } from "react-icons/lu";
import type { EventEnriched } from "@/content";
import EventProjectorOverlay from "./EventProjectorOverlay";
import TooltipButton from "@/components/Common/TooltipButton";

interface EventProjectorButtonProps {
  event: EventEnriched;
}

export default function EventProjectorButton({ event }: EventProjectorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TooltipButton
        onClick={() => setIsOpen(true)}
        className="btn btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Open projector view"
        tooltip="Projector view"
        tooltipPosition="top"
        data-testid="projector-view-button"
      >
        <LuProjector className="w-5 h-5" />
      </TooltipButton>
      <EventProjectorOverlay event={event} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
