import { useEffect, useState } from "react";

import { LuTimer } from "react-icons/lu";

import { type TimeParts, calculateTimeParts } from "@/utils/formatDate";

interface Props {
  eventDateTime: Date;
}

export default function EventCountdown({ eventDateTime }: Props) {
  // Calculate initial time left for server-side rendering
  const getInitialTimeLeft = () => {
    const now = new Date().getTime();
    const eventTime = new Date(eventDateTime).getTime();
    const difference = eventTime - now;

    if (difference <= 0) {
      return null;
    }

    return calculateTimeParts(difference);
  };

  const [timeLeft, setTimeLeft] = useState<TimeParts | null>(getInitialTimeLeft);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventTime = new Date(eventDateTime).getTime();
      const difference = eventTime - now;

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft(calculateTimeParts(difference));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [eventDateTime]);

  if (!timeLeft) return null;

  // Format the display string
  let displayText = "";
  if (timeLeft.days > 0) {
    displayText = `Starts in ${timeLeft.days} ${timeLeft.days === 1 ? "day" : "days"}`;
  } else if (timeLeft.hours > 0) {
    displayText = `Starts in ${timeLeft.hours} ${timeLeft.hours === 1 ? "hour" : "hours"}`;
  } else {
    displayText = `Starts in ${timeLeft.minutes} ${timeLeft.minutes === 1 ? "minute" : "minutes"}`;
  }

  return (
    <div className="flex items-start gap-2">
      <LuTimer className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
      <div className="min-w-0 break-words" data-testid="event-countdown">
        {displayText}
      </div>
    </div>
  );
}
