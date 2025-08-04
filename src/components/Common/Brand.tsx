import clsx from "clsx";

import { OKTechLogoRound, OKTechLogoText } from "@/components/Common/OKTechLogo";

interface BrandProps {
  fullText?: boolean;
  neutral?: boolean;
}

export default function Brand({ fullText = false, neutral = false }: BrandProps) {
  const logoSize = "w-12 h-12";
  const longText = "Osaka Kyoto Technology Meetup Group";

  return (
    <div className="group flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <OKTechLogoRound
          className={clsx(
            logoSize,
            "transition-transform duration-[1000ms] ease-in-out group-hover:-rotate-12",
          )}
          svgClass={clsx(neutral && "neutral")}
        />
        <OKTechLogoText className="h-auto w-28" svgClass={clsx((true || neutral) && "neutral")} />
      </div>
      {fullText && <span className="font-header text-sm">{longText}</span>}
    </div>
  );
}
