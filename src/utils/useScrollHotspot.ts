import { useEffect, useRef, useState } from "react";
import { isMobile } from "./isMobile";

interface UseScrollHotspotOptions {
  start: number; // percentage (0-100) of viewport height
  end: number; // percentage (0-100) of viewport height
  onlyMobile?: boolean; // whether to only activate on mobile devices
}

export function useScrollHotspot(
  options: UseScrollHotspotOptions = { start: 10, end: 30, onlyMobile: true },
) {
  const [isInHotspot, setIsInHotspot] = useState(false);
  const elementRef = useRef<HTMLDivElement | HTMLAnchorElement>(null);

  useEffect(() => {
    // Default onlyMobile to true if not specified
    const onlyMobile = options.onlyMobile ?? true;
    const isMobileDevice = isMobile();

    // Skip if onlyMobile is true and we're not on mobile
    if (onlyMobile && !isMobileDevice) {
      setIsInHotspot(false);
      return;
    }

    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;

      // Check if element center is in the configured viewport range
      const startPosition = viewportHeight * (options.start / 100);
      const endPosition = viewportHeight * (options.end / 100);
      const isInTargetZone = elementCenter >= startPosition && elementCenter <= endPosition;

      setIsInHotspot(isInTargetZone);
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [options.start, options.end, options.onlyMobile]);

  return { isInHotspot, elementRef };
}
