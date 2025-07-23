import { SOCIALS } from "@/constants";
import { FaFacebook } from "react-icons/fa";

export default function Socials() {
  return (
    <div className="grid grid-flow-col gap-4">
      {SOCIALS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="hover:text-primary transition-colors"
        >
          <FaFacebook size={18} />
        </a>
      ))}
    </div>
  );
}
