import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Container from "@/components/Common/Container";

interface Props {
  navigationClass: string;
  children: ReactNode;
  className?: string;
}

export default function StickyNavigation({ navigationClass, children, className }: Props) {
  const stickyNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stickyNav = stickyNavRef.current;
    if (!stickyNav) return;

    // Get the bottom navigation element
    const bottomNav = document.querySelector(`.${navigationClass}`);
    if (!bottomNav) return;

    let hasScrolledPast = false;

    // Create an intersection observer to watch when the bottom nav comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Get the position of the navigation relative to the viewport
          const navRect = entry.boundingClientRect;

          // Check if we've scrolled past the navigation (it's above the viewport)
          if (navRect.bottom < 0) {
            hasScrolledPast = true;
          } else if (navRect.top >= 0) {
            // Navigation is in view or below viewport
            hasScrolledPast = false;
          }

          if (entry.isIntersecting) {
            // Fade out when bottom nav is visible
            stickyNav.style.opacity = "0";
            stickyNav.style.pointerEvents = "none";
          } else if (!hasScrolledPast) {
            // Only fade in when bottom nav is not visible AND we haven't scrolled past it
            stickyNav.style.opacity = "1";
            stickyNav.style.pointerEvents = "auto";
          } else {
            // Keep hidden if we've scrolled past the navigation
            stickyNav.style.opacity = "0";
            stickyNav.style.pointerEvents = "none";
          }
        });
      },
      {
        // Trigger when the element is 50px from the bottom of the viewport
        rootMargin: "0px 0px 50px 0px",
        threshold: 0,
      },
    );

    // Start observing the bottom navigation
    observer.observe(bottomNav);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [navigationClass]);

  return (
    <div
      ref={stickyNavRef}
      className={`fixed bottom-0 left-0 right-0 z-40 soft-glass transition-opacity duration-300 ${className}`}
    >
      <Container className="py-2">{children}</Container>
    </div>
  );
}
