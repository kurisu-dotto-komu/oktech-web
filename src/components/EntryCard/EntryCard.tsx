import "./EntryCard.css";

import type { EventEnriched } from "@/content";

import EntryCardContentCountdown from "./EntryCardContentCountdown";
import EntryCardContentImage from "./EntryCardContentImage";
import EntryCardContentInfo from "./EntryCardContentInfo";
import EntryCardTrifold from "./EntryCardTrifold";
import type { AngleCalculationProps } from "./useEntryCardAngles";

interface Props extends Omit<AngleCalculationProps, "eventId"> {
  event: EventEnriched;
}

export default function EntryCard({ event, ...angleProps }: Props) {
  return (
    <EntryCardTrifold
      {...angleProps}
      eventId={event.id}
      leftPanel={<EntryCardContentCountdown event={event} />}
      midPanel={<EntryCardContentInfo event={event} />}
      rightPanel={<EntryCardContentImage event={event} />}
    />
  );
}
