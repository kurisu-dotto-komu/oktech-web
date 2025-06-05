export const DEFAULT_LOCALE = "en-US";

export const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Convenience helper around `Date#toLocaleDateString` so that we can keep the
 * locale and default formatting options in a single place. You can always pass
 * custom `Intl.DateTimeFormatOptions` when you need something different.
 */
export function formatDate(
  dateInput: string | number | Date,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
  locale: string = DEFAULT_LOCALE,
): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toLocaleDateString(locale, options);
}