import logoRoundSvg from "@/assets/oktech-logo-round-optimized.svg?raw";
import logoTextSvg from "@/assets/oktech-logo-text-optimized.svg?raw";

interface OKTechLogoProps {
  className?: string;
}

export default function OKTechLogo({ className = "" }: OKTechLogoProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: logoRoundSvg }} />;
}

export function OKTechLogoText({ className = "" }: OKTechLogoProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: logoTextSvg }} />;
}
