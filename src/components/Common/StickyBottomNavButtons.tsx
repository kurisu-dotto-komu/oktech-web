"use client";

import React, { useEffect, useRef } from "react";
import StickyBottomNavButton from "./StickyBottomNavButton";
import LinkReact from "@/components/Common/LinkReact";
import { LuChevronLeft, LuArrowLeft, LuList, LuUsers, LuCalendarDays } from "react-icons/lu";

interface NavigationItem {
  href: string;
  title: string;
  subtitle?: string;
  image?: { src: string };
}

interface Props {
  prevItem?: NavigationItem;
  nextItem?: NavigationItem;
  backButton?: {
    href: string;
    icon: string;
    text: string;
  };
  className?: string;
  class?: string;
  keyboardEvents?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "lucide:arrow-left": LuArrowLeft,
  "lucide:chevron-left": LuChevronLeft,
  "lucide:list": LuList,
  "lucide:users": LuUsers,
  "lucide:calendar-days": LuCalendarDays,
};

export default function StickyBottomNavButtons({
  prevItem,
  nextItem,
  backButton,
  className,
  class: classFromAstro,
  keyboardEvents = false,
}: Props) {
  const finalClassName = className || classFromAstro || "";
  const prevButtonRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLDivElement>(null);
  const isGalleryModalOpenRef = useRef(false);

  useEffect(() => {
    if (!keyboardEvents) return;

    // Handle gallery modal events
    const handleGalleryModalToggle = (e: CustomEvent) => {
      isGalleryModalOpenRef.current = e.detail.open;
    };

    window.addEventListener("gallery-modal-toggle", handleGalleryModalToggle as EventListener);

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle keyboard navigation if gallery modal is open
      if (isGalleryModalOpenRef.current) return;

      // Prevent navigation when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && prevItem?.href) {
        const prevButton = prevButtonRef.current?.querySelector("a");
        if (prevButton) {
          prevButton.click();
        }
      } else if (event.key === "ArrowRight" && nextItem?.href) {
        const nextButton = nextButtonRef.current?.querySelector("a");
        if (nextButton) {
          nextButton.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("gallery-modal-toggle", handleGalleryModalToggle as EventListener);
    };
  }, [prevItem, nextItem, keyboardEvents]);

  return (
    <div
      className={`w-full py-2 px-2 min-h-[3rem] ${finalClassName}`}
      data-testid="sticky-nav-buttons"
      data-keyboard-events={keyboardEvents ? "true" : "false"}
    >
      <div className="grid grid-cols-5 items-center gap-2">
        {/* Prev button - left column */}
        <div className=" col-span-2" ref={prevButtonRef}>
          {prevItem && <StickyBottomNavButton {...prevItem} />}
        </div>

        {/* Back button - center column, always centered */}
        <div className="flex justify-center">
          {backButton && (
            <LinkReact
              href={backButton.href}
              className="btn btn-neutral flex items-center justify-center whitespace-nowrap"
              title={backButton.text}
              data-testid="nav-button-back"
            >
              {backButton.icon &&
                iconMap[backButton.icon] &&
                React.createElement(iconMap[backButton.icon], { size: 20 })}
              <span className="ml-2 hidden sm:inline">{backButton.text}</span>
            </LinkReact>
          )}
        </div>

        {/* Next button - right column */}
        <div className="flex justify-end min-w-0  col-span-2" ref={nextButtonRef}>
          {nextItem && <StickyBottomNavButton {...nextItem} next />}
        </div>
      </div>
    </div>
  );
}
