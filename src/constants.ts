import type { IconType } from "react-icons";
import { FaDiscord, FaGithub, FaLinkedin, FaMeetup, FaXTwitter } from "react-icons/fa6";
import { LuCalendar, LuHouse, LuInfo, LuMap, LuRss } from "react-icons/lu";

// Development mode flag - change this to false for production
export const DEV_MODE = true;

const shortName = "OKTech";
const longName = "Osaka Kyoto Tech Meetup Group";
const name = `${shortName} - ${longName}`;

export const SITE = {
  name,
  shortName,
  longName,
  title: {
    default: name,
    template: "%s - " + name,
  },
} as const;

export const MENU: { label: string; href: string; header?: boolean; icon?: IconType }[] = [
  {
    label: "Home",
    href: "/",
    header: false,
    icon: LuHouse,
  },
  {
    label: "Events",
    href: "/events",
    icon: LuCalendar,
  },
  {
    label: "About",
    href: "/about",
    icon: LuInfo,
  },
  {
    label: "Sitemap",
    href: "/sitemap",
    header: false,
    icon: LuMap,
  },
  {
    label: "RSS",
    href: "/rss.xml",
    header: false,
    icon: LuRss,
  },
  {
    label: "ICS",
    href: "/oktech-events.ics",
    header: false,
    icon: LuCalendar,
  },
];

export const SOCIALS = [
  {
    icon: FaDiscord,
    href: "/discord",
    label: "Discord",
    description: "Chat with us on our Discord Server",
  },
  {
    icon: FaMeetup,
    href: "https://www.meetup.com/osaka-web-designers-and-developers-meetup/",
    label: "Meetup",
    description: "RSVP our next event on Meetup.com",
  },
  {
    icon: FaGithub,
    href: "https://github.com/owddm/owddm.com",
    label: "GitHub",
    description: "Developers can watch us on Github",
  },
  {
    icon: FaXTwitter,
    href: "https://x.com/owddm",
    label: "X (Twitter)",
    description: "Follow us on X (formally Twitter)",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/company/owddm-kwddm",
    label: "LinkedIn",
    description: "Todo",
  },
] as const;
