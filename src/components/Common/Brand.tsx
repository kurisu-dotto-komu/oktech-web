import OKTechLogo, { OKTechLogoText } from "@/components/Common/OKTechLogo";
import SpinningText from "@/components/Common/SpinningText";

interface BrandProps {
  fullText?: boolean;
  spinText?: boolean;
  big?: boolean;
}

export default function Brand({ fullText = false, big = false }: BrandProps) {
  const logoSize = big ? "w-80 h-80" : "w-12 h-12";
  const textSize = big ? "w-90" : "w-28 h-auto";
  const longText = "Osaka Kansai Technology Meetup Group";

  if (big) {
    return (
      <div className="flex flex-col items-center gap-8 text-center relative">
        <div className="relative">
          <OKTechLogo className={logoSize} />
          <SpinningText text={longText} radius={130} />
        </div>
        <OKTechLogoText className={textSize} />
      </div>
    );
  }

  return (
    <div className="flex gap-4 flex-col md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <OKTechLogo className={logoSize} />
        <OKTechLogoText className="w-28 h-auto " />
      </div>
      {fullText && <span className="text-sm opacity-80">{longText}</span>}
    </div>
  );
}
