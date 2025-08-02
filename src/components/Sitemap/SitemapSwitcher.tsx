import TooltipButton from "@/components/Common/TooltipButton";
import { LuList, LuImage } from "react-icons/lu";

interface SitemapSwitcherProps {
  currentView: "list" | "og";
}

export default function SitemapSwitcher({ currentView }: SitemapSwitcherProps) {
  const views = [
    { value: "list", label: "List view", icon: LuList, href: "/sitemap" },
    { value: "og", label: "OG Images view", icon: LuImage, href: "/sitemap/og" },
  ];

  return (
    <div className="join">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <TooltipButton
            key={view.value}
            as="link"
            href={view.href}
            tooltip={view.label}
            className={`btn join-item ${currentView === view.value ? "btn-active" : ""}`}
          >
            <Icon className="w-5 h-5" />
          </TooltipButton>
        );
      })}
    </div>
  );
}
