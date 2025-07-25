import OKTechLogo, { OKTechLogoText } from "@/components/Common/OKTechLogo";

interface BrandProps {
  fullText?: boolean;
}

export default function Brand({ fullText = false }: BrandProps) {
  return (
    <div className="flex gap-4 flex-col md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <OKTechLogo className="w-12 h-12" />
        <OKTechLogoText className="w-28 h-auto hidden md:block" />
      </div>
      {fullText && <span className="text-sm opacity-80">Osaka Kansai Technology Meetup Group</span>}
    </div>
  );
}
