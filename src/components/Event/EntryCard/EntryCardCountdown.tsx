"use client";

import { useEffect, useState } from "react";
import { EntryCardOfficial } from "./EntryCardDecorations";
import type { EventEnriched } from "@/content";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Props {
  targetDate: Date;
  duration: number; // Duration in hours
}

type EventStatus = "upcoming" | "inProgress" | "completed";

interface StatusInfo {
  textStyle: string;
  bgStyle: string;
  text: { jp: string; en: string };
  footer: { jp: string; en: string };
}

const STATUS_CONFIG: Record<EventStatus, StatusInfo> = {
  upcoming: {
    textStyle: "",
    bgStyle: "",
    text: { jp: "開催予定", en: "Upcoming" },
    footer: { jp: "開催まで", en: "Until Start" },
  },
  inProgress: {
    textStyle: "text-primary",
    bgStyle: "bg-primary/10",
    text: { jp: "開催中", en: "Started" },
    footer: { jp: "経過時間", en: "Elapsed" },
  },
  completed: {
    textStyle: "",
    bgStyle: "",
    text: { jp: "終了", en: "Concluded" },
    footer: { jp: "開催から", en: "Since End" },
  },
};

const getStatusInfo = (status: EventStatus): StatusInfo => STATUS_CONFIG[status];

interface CountdownRowProps {
  value: number;
  label: string;
}

function CountdownRow({ value, label }: CountdownRowProps) {
  return (
    <div className="flex flex-col">
      <div className="text-2xl font-mono">{value.toString().padStart(2, "0")}</div>
      <div className="text-xs text-base-content whitespace-nowrap">{label}</div>
    </div>
  );
}

export default function EntryCardCountdown({ event }: { event: EventEnriched }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [status, setStatus] = useState<EventStatus>("upcoming");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(event.data.dateTime).getTime();
      const end = start + (event.data.duration ?? 0) * 60 * 60 * 1000;

      if (now < start) {
        // Event hasn't started yet
        setStatus("upcoming");
        const difference = start - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else if (now >= start && now < end) {
        // Event is in progress - show elapsed time
        setStatus("inProgress");
        const elapsed = now - start;
        const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        setTimeElapsed({ days, hours, minutes, seconds });
      } else {
        // Event has completed - show total elapsed time
        setStatus("completed");
        const elapsed = now - start;
        const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        setTimeElapsed({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [event.data.dateTime, event.data.duration]);

  const statusInfo = getStatusInfo(status);
  const displayTime = status === "upcoming" ? timeLeft : timeElapsed;

  return (
    <div
      className={`flex p-2 md:p-0 md:flex-col h-full w-full flex-grow gap-2 justify-between md:justify-start ${statusInfo.bgStyle}`}
    >
      <div className={`flex p-2 flex-col ${statusInfo.textStyle}`}>
        <h3 className="text-base font-bold whitespace-nowrap">{statusInfo.text.jp}</h3>
        <div className="text-xs">{statusInfo.text.en}</div>
      </div>
      <div className="flex md:flex-col gap-6 flex-grow">
        <div className="flex px-2 gap-4 flex-grow md:flex-col justify-end md:justify-start">
          <CountdownRow value={displayTime.days} label="日 DAYS" />
          <CountdownRow value={displayTime.hours} label="時 HOURS" />
          <CountdownRow value={displayTime.minutes} label="分 MINS" />
          <CountdownRow value={displayTime.seconds} label="秒 SECS" />
        </div>
        <div className="flex flex-col justify-center p-2 md:p-0">
          <EntryCardOfficial top={statusInfo.footer.jp} bottom={statusInfo.footer.en} />
        </div>
      </div>
    </div>
  );
}
