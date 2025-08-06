import type { ComponentType } from "react";

import type { IconType } from "react-icons";
import { FaDiscord, FaGithub, FaLinkedin, FaMeetup, FaXTwitter } from "react-icons/fa6";
import { LuCalendar, LuFileText, LuHouse, LuInfo, LuMap, LuRss } from "react-icons/lu";

import ICSTooltipLink from "@/components/Common/ICSTooltipLink";

// Development mode flag - change this to false for production
export const DEV_MODE = true;

const shortName = "OKTech";
const longName = "Technology Meetup Group in Kansai - Osaka, Kyoto, Kobe, Hyogo";
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

export const MENU: {
  label: string;
  href: string;
  header?: boolean;
  icon?: IconType;
  footerMajor?: boolean;
  footerMinor?: boolean;
  component?: ComponentType<{ label: string; href: string; icon?: IconType }>;
  target?: string;
}[] = [
  {
    label: "Home",
    href: "/",
    footerMajor: true,
    icon: LuHouse,
  },
  {
    label: "Events",
    href: "/events",
    header: true,
    footerMajor: true,
    icon: LuCalendar,
  },
  {
    label: "About",
    href: "/about",
    header: true,
    footerMajor: true,
    icon: LuInfo,
  },
  {
    label: "Code of Conduct",
    href: "/code-of-conduct",
    icon: LuFileText,
    footerMinor: true,
  },
  {
    label: "Sitemap",
    href: "/sitemap",
    footerMinor: true,
    icon: LuMap,
  },
  {
    label: "RSS Feed",
    href: "/rss.xml",
    icon: LuRss,
    footerMinor: true,
    target: "_blank",
  },
  {
    label: "Calendar Feed",
    href: "/oktech-events.ics",
    icon: LuCalendar,
    footerMinor: true,
    component: ICSTooltipLink,
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
