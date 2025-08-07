import React, { useEffect, useRef } from "react";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // Speed multiplier (negative = slower than scroll, positive = faster)
  maxOffset?: number; // Maximum offset in pixels
  speedSm?: number; // Speed for small screens (<=640px)
  maxOffsetSm?: number; // Max offset for small screens
  className?: string;
  disabled?: boolean;
}

export default function Parallax({
  children,
  speed = -0.7, // Negative for traditional parallax (moves slower than scroll)
  maxOffset = 300,
  speedSm = -0.9,
  maxOffsetSm = 500,
  className = "",
  disabled = false,
}: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const lastScrollY = useRef<number>(0);
  const ticking = useRef<boolean>(false);

  useEffect(() => {
    if (disabled || !containerRef.current || !innerRef.current) return;

    const updateParallax = () => {
      if (!containerRef.current || !innerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Reason: Check if element is in viewport (with buffer for smoother experience)
      const buffer = 200;
      const isInViewport = rect.bottom > -buffer && rect.top < windowHeight + buffer;

      if (!isInViewport) {
        ticking.current = false;
        return;
      }

      // Reason: Determine which values to use based on screen size (640px is Tailwind's sm breakpoint)
      const isSmallScreen = windowWidth <= 640;
      const currentSpeed = isSmallScreen && speedSm !== undefined ? speedSm : speed;
      const currentMaxOffset = isSmallScreen && maxOffsetSm !== undefined ? maxOffsetSm : maxOffset;

      // Reason: Calculate parallax offset based on element position in viewport
      // Center of viewport is 0, top is -1, bottom is 1
      const viewportCenter = windowHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const relativePosition = (elementCenter - viewportCenter) / viewportCenter;

      // Reason: Apply speed multiplier and clamp to max offset
      let offset = relativePosition * currentSpeed * 100;
      offset = Math.max(-currentMaxOffset, Math.min(currentMaxOffset, offset));

      // Reason: Round to nearest 0.01 for smoother animation while avoiding excessive precision
      offset = Math.round(offset * 100) / 100;

      // Reason: Use transform3d for hardware acceleration
      innerRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;

      ticking.current = false;
    };

    const handleScroll = () => {
      lastScrollY.current = window.scrollY;

      if (!ticking.current) {
        frameRef.current = window.requestAnimationFrame(updateParallax);
        ticking.current = true;
      }
    };

    // Reason: Initial position setup
    updateParallax();

    // Reason: Passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [disabled, speed, maxOffset, speedSm, maxOffsetSm]);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className}`}>
      <div
        className="h-full w-full"
        ref={innerRef}
        style={{
          willChange: "transform",
          // Reason: Promote to its own layer for better performance
          transform: "translate3d(0, 0, 0)",
          // Reason: Prevent blurry text on some browsers
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {children}
      </div>
    </div>
  );
}
