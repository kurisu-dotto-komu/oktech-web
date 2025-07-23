import LinkReact from "@/components/Common/LinkReact";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

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
      className={`btn h-12 btn-soft p-0 px-1 max-w-full ${isNext ? "flex-row-reverse" : ""} ${finalClassName}`}
      title={title}
    >
      {isNext ? (
        <LuChevronRight size={20} className="mx-1 md:mx-2 flex-shrink-0" />
      ) : (
        <LuChevronLeft size={20} className="mx-1 md:mx-2 flex-shrink-0" />
      )}

      {image && (
        <figure className="aspect-video h-full flex-shrink-0 overflow-hidden rounded bg-base-300">
          <img
            src={image.src}
            alt={title || ""}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </figure>
      )}

      <div
        className={`flex flex-col px-2 py-3 min-w-0 max-w-60 ${isNext ? "text-right" : "text-left"}`}
      >
        {title && <div className="text-xs md:text-sm font-semibold truncate">{title}</div>}
        {subtitle && <div className="text-xs opacity-70 truncate">{subtitle}</div>}
      </div>
    </LinkReact>
  );
}
