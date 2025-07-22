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
    <div className={`flex gap-4 w-full py-2 ${finalClassName}`}>
      {prevItem && (
        <div className="flex-1">
          <StickyBottomNavButton {...prevItem} />
        </div>
      )}
      {backButton && (
        <div className="bg-blue-200 flex-0">
          <LinkReact
            href={backButton.href}
            className="btn btn-neutral flex items-center justify-center h-full whitespace-nowrap"
            title={backButton.text}
          >
            {backButton.icon &&
              iconMap[backButton.icon] &&
              React.createElement(iconMap[backButton.icon], { size: 20 })}
            <span className="ml-2 hidden sm:inline">{backButton.text}</span>
          </LinkReact>
        </div>
      )}
      {nextItem && (
        <div className="text-end flex-1">
          <StickyBottomNavButton {...nextItem} next />
        </div>
      )}
    </div>
  );
}
