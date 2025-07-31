export function isMobile(): boolean {
  // Check user agent for mobile devices
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

  // Check for mobile-specific features
  const hasTouchStart = "ontouchstart" in window;
  const touchPoints = navigator.maxTouchPoints > 1;

  // Check viewport, but only as a secondary indicator
  const isSmallViewport = window.matchMedia("(max-width: 768px)").matches;

  // Consider it mobile if user agent indicates mobile OR
  // if it has touch capabilities AND small viewport
  const result = isMobileUserAgent || (hasTouchStart && touchPoints && isSmallViewport);

  return result;
}
