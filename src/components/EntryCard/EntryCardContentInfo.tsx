import EventIconList from "@/components/Event/EventIconList";
import type { EventEnriched } from "@/content";

import { EntryCardHeader } from "./EntryCardDecorations";

export default function EntryCardContentInfo({ event }: { event: EventEnriched }) {
  return (
    <div className="border-base-300 h-full border-x-0 border-y-1 border-dashed md:border-x-1 md:border-y-0">
      <EntryCardHeader
        description={"会合団体行事詳細 MEETUP GROUP EVENT DETAILS ①"}
        text={"【INFORMATION】"}
      />
      <div className="h-full overflow-hidden px-4 pb-2">
        <h3 className="my-3 text-xl font-bold">{event.data.title}</h3>
        <EventIconList event={event} />
      </div>
    </div>
  );
}
