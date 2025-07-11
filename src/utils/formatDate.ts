export type DateFormat = "long" | "short" | "short-no-year";

export function formatDate(date: Date | string, format: DateFormat = "short"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (format === "long") {
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Tokyo",
    });
  }

  if (format === "short-no-year") {
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "Asia/Tokyo",
    });
  }

  // short format
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Tokyo",
  });
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  });
}

export function formatDateTime(date: Date | string, format: DateFormat = "short"): string {
  return `${formatDate(date, format)} • ${formatTime(date)}`;
}
