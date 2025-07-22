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
      className={`btn h-12 btn-soft flex-1 p-0 px-1 ${isNext ? "flex-row-reverse" : ""} ${finalClassName}`}
      title={title}
    >
      {isNext ? (
        <LuChevronRight size={20} className="mx-1 md:mx-2 flex-shrink-0" />
      ) : (
        <LuChevronLeft size={20} className="mx-1 md:mx-2 flex-shrink-0" />
      )}

      {image && (
        <figure className="aspect-video h-full flex-shrink-0 overflow-hidden rounded bg-base-300 hidden sm:block">
          <img
            src={image.src}
            alt={title || ""}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </figure>
      )}

      <div className={`flex flex-col flex-1 px-2 py-3 ${isNext ? "text-right" : "text-left"}`}>
        <div className="flex gap-1 items-baseline text-xs opacity-70 font-normal flex-col md:flex-row">
          {subtitle && <div className="">{subtitle}</div>}
        </div>
        <div className="text-xs hidden sm:inline-block md:text-sm font-semibold truncate lg:max-w-60 overflow-hidden">
          {title}
        </div>
      </div>
    </LinkReact>
  );
}
