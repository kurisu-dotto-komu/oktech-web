import { SOCIALS } from "@/constants";

import BlobCard from "./BlobCard";

export default function SocialsBig() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-4" data-testid="socials-big">
      {SOCIALS.map((social, index) => (
        <BlobCard key={social.label} preset={index} className="">
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-4 p-12 py-18 text-inherit no-underline"
          >
            <social.icon className="h-14 w-14" />
            <div className="flex flex-col items-center justify-center">
              <div className="font-header text-3xl font-bold">{social.label}</div>
              <div className="max-w-[200px] text-center text-sm tracking-wider whitespace-nowrap uppercase">
                {social.description}
              </div>
            </div>
          </a>
        </BlobCard>
      ))}
    </div>
  );
}
