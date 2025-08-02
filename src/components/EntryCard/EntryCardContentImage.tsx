import type { EventEnriched } from "@/content";

import { EntryCardFooter, EntryCardHeader } from "./EntryCardDecorations";

export default function EntryCardContentImage({ event }: { event: EventEnriched }) {
  return (
    <div className="h-full">
      <EntryCardHeader
        description={"会合団体行事雰囲気画像 MEETUP GROUP EVENT FLAVOR IMAGE ②"}
        text={"【VISUAL】"}
      />
      <div className="m-2 mt-1 flex-grow">
        <img
          src={event.data.cover.src}
          alt="Event cover"
          className="border-base-content/20 aspect-video h-full w-full rounded-md border border-dashed object-cover"
          width={512}
          height={512}
        />
      </div>
      <EntryCardFooter
        text={"お楽しみください。Please enjoy."}
        top={"画像はイメージです"}
        bottom={"The image is an image"}
      />
    </div>
  );
}
