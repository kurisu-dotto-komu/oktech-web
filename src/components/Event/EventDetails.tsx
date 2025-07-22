import EventInfo from "./EventInfo";
import type { EventWithVenue } from "@/data";
import EventJoinButton from "./EventJoinButton";
import EventProjectorButton from "./EventProjectorButton";
import ReactMarkdown from "react-markdown";

interface Props {
  event: EventWithVenue;
}

export default function EventDetails({ event }: Props) {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="md:hidden flex flex-col gap-10">
        <h1 className="text-4xl font-bold pt-6">{event.data.title}</h1>
        <EventInfo event={event} />
        <EventJoinButton />
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-2/3 flex flex-col gap-10">
          <figure className="rounded-xl aspect-video w-full bg-base-300 shadow-xl overflow-hidden">
            {event.data.cover ? (
              <img
                src={event.data.cover.src}
                alt={event.data.title}
                className="w-full h-full object-cover"
                width={512}
                height={512}
              />
            ) : (
              <div className="w-full h-full bg-base-300" />
            )}
          </figure>
          <h1 className="hidden md:block text-4xl font-bold pt-6">{event.data.title}</h1>
          {event.data.markdownContent && (
            <div className="max-w-none prose prose-lg">
              <ReactMarkdown>{event.data.markdownContent}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="hidden md:block md:w-1/3 relative">
          <div className="sticky top-20 flex flex-col gap-8">
            <div className="card bg-base-100 shadow-lg rounded-lg overflow-hidden">
              <div className="card-body p-0">
                <EventInfo event={event} />
              </div>
            </div>
            <EventJoinButton />
          </div>
        </div>
      </div>

      {/* Projector button at the bottom */}
      <div className="mt-8 flex justify-center">
        <EventProjectorButton event={event} />
      </div>
    </div>
  );
}
