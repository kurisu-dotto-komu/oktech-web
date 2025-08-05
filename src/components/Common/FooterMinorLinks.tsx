import LinkReact from "@/components/Common/LinkReact";
import { MENU } from "@/constants";

export default function FooterMinorLinks() {
  const minorItems = MENU.filter((item) => item.footerMinor === true);

  return (
    <div className="flex flex-wrap justify-center gap-4" data-testid="footer-minor-links">
      {minorItems.map((item) => (
        <LinkReact key={item.href} href={item.href} className="link link-hover">
          {item.label}
        </LinkReact>
      ))}
    </div>
  );
}
