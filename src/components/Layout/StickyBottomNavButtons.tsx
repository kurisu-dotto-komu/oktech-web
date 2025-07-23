import React from "react";
import StickyBottomNavButton from "./StickyBottomNavButton";
import LinkReact from "@/components/Common/LinkReact";
import { LuChevronLeft, LuArrowLeft, LuList } from "react-icons/lu";

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
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "lucide:arrow-left": LuArrowLeft,
  "lucide:chevron-left": LuChevronLeft,
  "lucide:list": LuList,
};

export default function StickyBottomNavButtons({
  prevItem,
  nextItem,
  backButton,
  className,
  class: classFromAstro,
}: Props) {
  const finalClassName = className || classFromAstro || "";

  return (
    <div className={`w-full py-2 px-2 min-h-[3rem] ${finalClassName}`}>
      <div className="grid grid-cols-5 items-center gap-2">
        {/* Prev button - left column */}
        <div className=" col-span-2">{prevItem && <StickyBottomNavButton {...prevItem} />}</div>

        {/* Back button - center column, always centered */}
        <div className="flex justify-center">
          {backButton && (
            <LinkReact
              href={backButton.href}
              className="btn btn-neutral flex items-center justify-center whitespace-nowrap"
              title={backButton.text}
            >
              {backButton.icon &&
                iconMap[backButton.icon] &&
                React.createElement(iconMap[backButton.icon], { size: 20 })}
              <span className="ml-2 hidden sm:inline">{backButton.text}</span>
            </LinkReact>
          )}
        </div>

        {/* Next button - right column */}
        <div className="flex justify-end min-w-0  col-span-2">
          {nextItem && <StickyBottomNavButton {...nextItem} next />}
        </div>
      </div>
    </div>
  );
}
