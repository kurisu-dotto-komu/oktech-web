import { OKTechLogoRound, OKTechLogoText } from "@/components/Common/OKTechLogo";
import SpinningText from "@/components/Common/SpinningText";
import clsx from "clsx";

interface BrandProps {
  fullText?: boolean;
  spinText?: boolean;
  big?: boolean;
  neutral?: boolean;
}

export default function Brand({ fullText = false, big = false, neutral = false }: BrandProps) {
  const logoSize = big ? "w-80 h-80" : "w-12 h-12";
  const textSize = big ? "w-90" : "w-28 h-auto";
  const longText = "Osaka Kansai Technology Meetup Group";

  if (big) {
    return (
      <div className="flex flex-col items-center gap-8 text-center relative">
        <div className="relative">
          <OKTechLogoRound className={logoSize} />
          <SpinningText text={longText} radius={131} />
        </div>
        <OKTechLogoText className={textSize} />
      </div>
    );
  }

  return (
    <div className="flex gap-4 flex-col md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <OKTechLogoRound className={logoSize} svgClass={clsx(neutral && "neutral")} />
        <OKTechLogoText className="w-28 h-auto " svgClass={clsx(neutral && "neutral")} />
      </div>
      {fullText && <span className="text-sm font-header">{longText}</span>}
    </div>
  );
}
