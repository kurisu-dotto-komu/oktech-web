import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import LinkReact from "@/components/Common/LinkReact";

interface Props {
  href?: string;
  title?: string;
  subtitle?: string;
  image?: { src: string };
  next?: boolean;
  className?: string;
  class?: string;
}

export default function StickyBottomNavButton({
  href,
  title,
  subtitle,
  image,
  next = false,
  className,
  class: classFromAstro,
}: Props) {
  const finalClassName = className || classFromAstro || "";
  const isNext = next;

  if (!href) return null;

  return (
    <LinkReact
      href={href}
      className={`btn btn-soft h-12 max-w-full p-0 px-1 ${isNext ? "flex-row-reverse" : ""} ${finalClassName}`}
      title={title}
      data-testid={isNext ? "nav-button-next" : "nav-button-prev"}
    >
      {isNext ? (
        <LuChevronRight size={20} className="mx-1 flex-shrink-0 md:mx-2" />
      ) : (
        <LuChevronLeft size={20} className="mx-1 flex-shrink-0 md:mx-2" />
      )}

      {image && (
        <figure className="bg-base-300 aspect-video h-full flex-shrink-0 overflow-hidden rounded">
          <img
            src={image.src}
            alt={title || ""}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </figure>
      )}

      <div
        className={`flex max-w-60 min-w-0 flex-col px-2 py-3 ${isNext ? "text-right" : "text-left"}`}
      >
        {title && <div className="truncate text-xs font-semibold md:text-sm">{title}</div>}
        {subtitle && <div className="truncate text-xs opacity-70">{subtitle}</div>}
      </div>
    </LinkReact>
  );
}
