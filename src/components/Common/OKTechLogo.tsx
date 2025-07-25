import logoTextSvg from "@/assets/oktech-logo-text-optimized.svg?raw";
import logoRoundSvg from "@/assets/oktech-logo-round-optimized.svg?raw";
import ScopedSVG from "@/components/Common/ScopedSVG";

interface OKTechLogoProps {
  className?: string;
  svgClass?: string;
}
export function OKTechLogoRound({ className, svgClass }: OKTechLogoProps) {
  return <ScopedSVG svg={logoRoundSvg} className={className} svgClass={svgClass} />;
}

export function OKTechLogoText({ className = "", svgClass }: OKTechLogoProps) {
  return <ScopedSVG svg={logoTextSvg} className={className} svgClass={svgClass} />;
}
