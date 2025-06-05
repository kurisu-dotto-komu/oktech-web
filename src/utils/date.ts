export const DEFAULT_LOCALE = "en-US";

type Preset = "short" | "long";

const PRESET_OPTIONS: Record<Preset, Intl.DateTimeFormatOptions> = {
  short: {
    month: "short",
    day: "numeric",
  },
  long: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
};

/**
 * Formats a date using predefined option presets.
 *
 * @param date   Date value or something coercible to a Date.
 * @param preset Choose a preset: "short" (e.g. May 8) or "long" (e.g. May 8, 2025).
 * @param locale Optional BCP-47 locale. Defaults to en-US.
 */
export function formatDate(
  date: Date | string | number,
  preset: Preset = "long",
  locale: string = DEFAULT_LOCALE,
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(locale, PRESET_OPTIONS[preset]);
}