import { SOCIALS } from "@/components/Common/Socials";
import IconCard from "./IconCard";

export default function SocialsBig() {
  return (
    <div className="flex flex-wrap gap-4 items-start justify-center">
      {SOCIALS.map((social) => (
        <IconCard key={social.label} {...social} />
      ))}
    </div>
  );
}
