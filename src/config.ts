// Development mode flag - change this to false for production
export const DEV_MODE = true;

const shortName = "OKWireframe";
const longName = "Osaka Kansai Wireframe Meetup Group";
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

export const MENU: { label: string; href: string; header?: boolean; icon?: string }[] = [
  {
    label: "Home",
    href: "/",
    header: false,
    icon: "lucide:home",
  },
  {
    label: "Events",
    href: "/events",
    icon: "lucide:calendar",
  },
  {
    label: "Community",
    href: "/community",
    icon: "lucide:users",
  },
  {
    label: "About",
    href: "/about",
    icon: "lucide:info",
  },
  {
    label: "Sitemap",
    href: "/sitemap",
    header: false,
    icon: "lucide:map",
  },
  {
    label: "RSS",
    href: "/rss.xml",
    header: false,
    icon: "lucide:rss",
  },
];

export const SOCIALS = [
  // {
  //   icon: "lucide:mail",
  //   href: "mailto:todo@example.com",
  //   label: "Email",
  //   description: "Send us a good old fashioned Email",
  // },
  {
    icon: "cib:twitter",
    href: "https://x.com/owddm",
    label: "X (Twitter)",
    description: "Follow us on X (formally Twitter)",
  },
  {
    icon: "cib:github",
    href: "https://github.com/owddm/owddm.comm",
    label: "GitHub",
    description: "Developers can watch us on Github",
  },
  {
    icon: "cib:discord",
    href: "/discord",
    label: "Discord",
    description: "Chat with us on our Discord Server",
  },
  {
    icon: "cib:meetup",
    href: "https://www.meetup.com/ja-JP/osaka-web-designers-and-developers-meetup/",
    label: "Meetup",
    description: "RSVP our next event on Meetup.com",
  },

  {
    icon: "cib:linkedin",
    href: "#",
    label: "LinkedIn",
    description: "Todo",
  },
] as const;

export const THEMES = [
  "abyss",
  "acid",
  "aqua",
  "autumn",
  "black",
  "bumblebee",
  "business",
  "caramellatte",
  "cmyk",
  "coffee",
  "corporate",
  "cupcake",
  "cyberpunk",
  "dark",
  "dim",
  "dracula",
  "emerald",
  "fantasy",
  "forest",
  "garden",
  "halloween",
  "lemonade",
  "light",
  "lofi",
  "luxury",
  "night",
  "nord",
  "pastel",
  "retro",
  "silk",
  "sunset",
  "synthwave",
  "valentine",
  "winter",
  "wireframe",
] as const;
