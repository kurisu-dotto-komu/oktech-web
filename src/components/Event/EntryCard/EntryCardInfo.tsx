import type { EventEnriched } from "@/content";
import { EntryCardHeader } from "./EntryCardDecorations";
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
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default function EntryCardInfo({ event }: { event: EventEnriched }) {
  return (
    <>
      <EntryCardHeader
        description={"会合団体行事詳細 MEETUP GROUP EVENT DETAILS ①"}
        text={"【INFORMATION】"}
      />
      <div className="h-full px-4 overflow-hidden pb-2">
        <h3 className="font-bold text-xl my-3">{event.data.title}</h3>

        <div className="flex flex-col gap-2 text-sm">
          {/* Date and Time */}
          <InfoItem icon={LuCalendar}>
            <span className="truncate">{formatDate(event.data.dateTime, "long")}</span>
          </InfoItem>

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

          {/* Venue Information */}
          {event.venue && (
            <>
              {event.venue.city && (
                <InfoItem icon={LuMap}>
                  <span className="capitalize">{event.venue.city}</span>
                </InfoItem>
              )}

              <InfoItem icon={LuBuilding}>
                <span className="truncate">{event.venue.title}</span>
              </InfoItem>

              {event.venue.address && (
                <InfoItem icon={LuMapPin}>
                  <span>{event.venue.address}</span>
                </InfoItem>
              )}
            </>
          )}

          {/* Topics */}
          {event.data.topics && event.data.topics.length > 0 && (
            <InfoItem icon={LuTag}>
              <div className="flex flex-wrap gap-1">
                {event.data.topics.map((topic, index) => (
                  <span key={index} className="px-2 py-0.5 bg-primary/10 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </InfoItem>
          )}
        </div>
      </div>
    </>
  );
}
