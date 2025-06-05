export const DEFAULT_LOCALE = "en-US";
export const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export interface FormatDateParams {
  /**
   * BCP 47 language tag to be passed to Intl.DateTimeFormat.
   * Defaults to `en-US`.
   */
  locale?: string;
  /**
   * Intl.DateTimeFormat options to control the output.
   * Defaults to `{ year: "numeric", month: "long", day: "numeric" }`.
   */
  options?: Intl.DateTimeFormatOptions;
}

/**
 * formatDate
 * -----------
 * Formats a date using `toLocaleDateString` but centralises the default locale
 * and formatting options so that they can be configured in one place.
 *
 * @example
 *   formatDate("2024-05-01"); // -> "May 1, 2024"
 *   formatDate(myDate, { options: { month: "short", day: "numeric" } }); // -> "May 1"
 */
export function formatDate(
  date: Date | string | number,
  { locale = DEFAULT_LOCALE, options = DEFAULT_OPTIONS }: FormatDateParams = {},
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(locale, options);
}