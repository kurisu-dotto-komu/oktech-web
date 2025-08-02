import { SOCIALS } from "@/constants";

import IconCard from "./IconCard";

export default function SocialsBig() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-4">
      {SOCIALS.map((social) => (
        <IconCard key={social.label} {...social} />
      ))}
    </div>
  );
}
