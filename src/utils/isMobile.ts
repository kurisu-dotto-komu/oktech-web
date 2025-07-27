export function isMobile(): boolean {
  const mediaQueryMatch = window.matchMedia("(max-width: 768px)").matches;
  const hasTouchStart = "ontouchstart" in window;
  const touchPoints = navigator.maxTouchPoints;

  const result = mediaQueryMatch || hasTouchStart || touchPoints > 0;

  return result;
}
