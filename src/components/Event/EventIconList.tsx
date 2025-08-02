import type { ReactNode } from "react";

import type { IconType } from "react-icons";
import { LuBuilding, LuCalendar, LuClock, LuMap, LuMapPin, LuTag } from "react-icons/lu";

import type { EventEnriched } from "@/content";
import { formatDate, formatDuration, formatTime, getEndTime } from "@/utils/formatDate";

import EventCountdown from "./EventCountdown";

interface InfoItemProps {
  icon: IconType;
  children: ReactNode;
}

function InfoItem({ icon: Icon, children }: InfoItemProps) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
      <div className="min-w-0 break-words">{children}</div>
    </div>
  );
}

export type EventStatKey = "date" | "time" | "city" | "venue" | "address" | "topics";

interface EventIconListProps {
  event: EventEnriched;
  stats?: EventStatKey[];
  showCountdown?: boolean;
}

const defaultStats: EventStatKey[] = ["date", "time", "city", "venue", "address", "topics"];

export default function EventIconList({
  event,
  stats = defaultStats,
  showCountdown = false,
}: EventIconListProps) {
  const isUpcoming = new Date(event.data.dateTime) > new Date();
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
              <span key={index} className="bg-primary/10 rounded-full px-2 py-0.5">
                {topic}
              </span>
            ))}
          </div>
        </InfoItem>
      ) : null,
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      {showCountdown && isUpcoming && (
        <div key="countdown">
          <EventCountdown eventDateTime={event.data.dateTime} />
        </div>
      )}
      {stats.map((stat) => {
        const renderer = statRenderers[stat];
        return renderer ? <div key={stat}>{renderer()}</div> : null;
      })}
    </div>
  );
}
