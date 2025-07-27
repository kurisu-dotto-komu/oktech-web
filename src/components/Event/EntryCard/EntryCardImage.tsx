import type { EventEnriched } from "@/content";
import { EntryCardFooter, EntryCardHeader } from "./EntryCardDecorations";

export default function EntryCardImage({
  event,
  shadow = false,
}: {
  event: EventEnriched;
  shadow?: boolean;
}) {
  return (
    <>
      <EntryCardHeader
        description={"会合団体行事雰囲気画像 MEETUP GROUP EVENT FLAVOR IMAGE ②"}
        text={"【VISUAL】"}
      />
      <div className="m-2 mt-1 flex-grow">
        <img
          src={event.data.cover.src}
          alt="Event cover"
          className="w-full h-full aspect-video object-cover rounded-md border border-dashed border-base-content/20"
          width={512}
          height={512}
          style={shadow ? undefined : { viewTransitionName: `event-image-${event.id}` }}
        />
      </div>
      <EntryCardFooter
        text={"お楽しみください。Please enjoy."}
        top={"画像はイメージです"}
        bottom={"The image is an image"}
      />
    </>
  );
}
