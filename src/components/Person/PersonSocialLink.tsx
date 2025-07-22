import { LuMail, LuGlobe } from "react-icons/lu";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const SocialIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "email":
      return <LuMail size={20} />;
    case "website":
      return <LuGlobe size={20} />;
    case "github":
      return <FaGithub size={20} />;
    case "twitter":
      return <FaTwitter size={20} />;
    case "linkedin":
      return <FaLinkedin size={20} />;
    default:
      return <LuGlobe size={20} />;
  }
};

interface PersonSocialLinkProps {
  url: string | undefined;
  type: "github" | "twitter" | "linkedin" | "email" | "website";
}

export default function PersonSocialLink({ url, type }: PersonSocialLinkProps) {
  // If no URL provided, render nothing
  if (!url) return null;

  // Extract username from social links
  const getUsername = (url: string) => {
    return url.split("/").pop() || url;
  };

  const displayText =
    type === "email"
      ? url
      : type === "website"
        ? url.replace(/^https?:\/\//, "")
        : `@${getUsername(url)}`;
  const href = type === "email" ? `mailto:${url}` : url;

  return (
    <a
      href={href}
      target={type === "email" ? undefined : "_blank"}
      rel={type === "email" ? undefined : "noopener noreferrer"}
      className="text-lg link link-hover flex items-center gap-2"
    >
      <SocialIcon type={type} />
      {displayText}
    </a>
  );
}
