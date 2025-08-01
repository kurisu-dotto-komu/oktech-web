import type { EventEnriched } from "@/content";
import { EntryCardHeader } from "./EntryCardDecorations";
import EventIconList from "@/components/Event/EventIconList";

export default function EntryCardContentInfo({ event }: { event: EventEnriched }) {
  return (
    <div className="border-x-0 md:border-x-1 border-y-1 md:border-y-0 border-dashed border-base-300 h-full">
      <EntryCardHeader
        description={"会合団体行事詳細 MEETUP GROUP EVENT DETAILS ①"}
        text={"【INFORMATION】"}
      />
      <div className="h-full px-4 overflow-hidden pb-2">
        <h3 className="font-bold text-xl my-3">{event.data.title}</h3>
        <EventIconList event={event} />
      </div>
    </div>
  );
}
