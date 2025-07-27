import type { EventEnriched } from "@/content";
import EntryCardFolding, { type AngleCalculationProps } from "./EntryCardFolding";
import EntryCardPanel from "./EntryCardPanel";
import EntryCardCountdown from "./EntryCardCountdown";
import EntryCardImage from "./EntryCardImage";
import EntryCardInfo from "./EntryCardInfo";

interface Props extends Omit<AngleCalculationProps, "eventId"> {
  event: EventEnriched;
}

export default function EntryCard({ event, ...angleProps }: Props) {
  return (
    <EntryCardFolding {...angleProps} eventId={event.id}>
      <EntryCardPanel className="col-span-1 flex items-center">
        <EntryCardCountdown event={event} />
      </EntryCardPanel>
      <EntryCardPanel cut className="col-span-5 border-x-1 border-dashed border-base-300">
        <EntryCardInfo event={event} />
      </EntryCardPanel>
      <EntryCardPanel cut className="col-span-6">
        <EntryCardImage event={event} />
      </EntryCardPanel>
    </EntryCardFolding>
  );
}
