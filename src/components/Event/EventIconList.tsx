import type { EventEnriched } from "@/content";
import { LuCalendar, LuClock, LuMapPin, LuTag, LuBuilding, LuMap } from "react-icons/lu";
import type { IconType } from "react-icons";
import type { ReactNode } from "react";
import { formatDate, formatDuration, formatTime, getEndTime } from "@/utils/formatDate";

interface InfoItemProps {
  icon: IconType;
  children: ReactNode;
}

function InfoItem({ icon: Icon, children }: InfoItemProps) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
      <div className="min-w-0 break-words">{children}</div>
    </div>
  );
}

export type EventStatKey = "date" | "time" | "city" | "venue" | "address" | "topics";

interface EventIconListProps {
  event: EventEnriched;
  stats?: EventStatKey[];
}

const defaultStats: EventStatKey[] = ["date", "time", "city", "venue", "address", "topics"];

export default function EventIconList({ event, stats = defaultStats }: EventIconListProps) {
  const statRenderers: Record<EventStatKey, () => ReactNode> = {
    date: () => (
      <InfoItem icon={LuCalendar}>
        <span data-testid="event-date" data-date={event.data.dateTime}>
          {formatDate(event.data.dateTime, "long")}
        </span>
      </InfoItem>
    ),
    time: () => (
      <InfoItem icon={LuClock}>
        <span>
          {formatTime(event.data.dateTime)}
          {event.data.duration && (
            <>
              {" - "}
              {formatTime(getEndTime(event.data.dateTime, event.data.duration)!)}
              <span className="text-base-content/50 pl-2">
                {formatDuration(event.data.duration)}
              </span>
            </>
          )}
        </span>
      </InfoItem>
    ),
    city: () =>
      event.venue?.city ? (
        <InfoItem icon={LuMap}>
          <span className="capitalize">{event.venue.city}</span>
        </InfoItem>
      ) : null,
    venue: () =>
      event.venue ? (
        <InfoItem icon={LuBuilding}>
          <span>{event.venue.title}</span>
        </InfoItem>
      ) : null,
    address: () =>
      event.venue?.address ? (
        <InfoItem icon={LuMapPin}>
          <span>{event.venue.address}</span>
        </InfoItem>
      ) : null,
    topics: () =>
      event.data.topics && event.data.topics.length > 0 ? (
        <InfoItem icon={LuTag}>
          <div className="flex flex-wrap gap-1">
            {event.data.topics.map((topic, index) => (
              <span key={index} className="px-2 py-0.5 bg-primary/10 rounded-full">
                {topic}
              </span>
            ))}
          </div>
        </InfoItem>
      ) : null,
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      {stats.map((stat) => {
        const renderer = statRenderers[stat];
        return renderer ? <div key={stat}>{renderer()}</div> : null;
      })}
    </div>
  );
}
