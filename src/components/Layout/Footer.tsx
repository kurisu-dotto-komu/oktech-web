import Socials from "@/components/Common/Socials";
import Container from "@/components/Common/Container";
import { MENU } from "@/constants";
import LinkReact from "@/components/Common/LinkReact";
import { formatDate } from "@/utils/formatDate";
import Brand from "@/components/Common/Brand";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { LuHouse, LuCalendar, LuUsers, LuInfo, LuMap, LuRss } from "react-icons/lu";

const iconMap = {
  "lucide:home": LuHouse,
  "lucide:calendar": LuCalendar,
  "lucide:users": LuUsers,
  "lucide:info": LuInfo,
  "lucide:map": LuMap,
  "lucide:rss": LuRss,
};

export default function Footer() {
  return (
    <footer className="bg-base-300 text-base-content">
      <Container className="flex flex-col py-10 gap-8 sm:gap-4">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-8">
          <nav className="flex gap-1 flex-wrap justify-center -mx-4">
            {MENU.map((item) => {
              const IconComponent = item.icon ? iconMap[item.icon as keyof typeof iconMap] : null;
              return (
                <LinkReact
                  key={item.href}
                  href={item.href}
                  className="btn btn-ghost gap-2 text-sm items-center justify-start"
                >
                  {IconComponent && <IconComponent />}
                  {item.label}
                </LinkReact>
              );
            })}
          </nav>
          <div className="flex gap-4 items-center">
            <Socials />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex justify-between items-center sm:items-baseline flex-col sm:flex-row gap-8">
          <div>
            <Brand fullText />
          </div>
          <div className="text-xs">
            <a
              href="https://github.com/owddm/owddm.github.io/commit/e83f4545b44cd939e4f8ea390afbd83697e4c885"
              target="_blank"
              className="link link-hover"
            >
              Built with <code className="badge badge-xs">{`<3`}</code> on{" "}
              {formatDate(new Date(), "long")}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
