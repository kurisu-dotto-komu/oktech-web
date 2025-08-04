import { LuMenu } from "react-icons/lu";

import Brand from "@/components/Common/Brand";
import Container from "@/components/Common/Container";
import LinkReact from "@/components/Common/LinkReact";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { MENU } from "@/constants";

export default function TopBar() {
  const items = MENU.filter((item) => item.header !== false);

  return (
    <div data-testid="top-bar">
      <div className="soft-glass navbar fixed top-0 z-50 shadow-sm" data-testid="navbar">
        <Container className="hidden justify-between md:flex">
          <div className="navbar-start">
            <LinkReact href="/" className="btn btn-ghost p-1">
              <Brand />
            </LinkReact>
          </div>
          <div className="navbar-end">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {items.map((item) => (
                  <LinkReact
                    key={item.label}
                    href={item.href}
                    className="btn btn-ghost items-center justify-start gap-3 text-lg"
                  >
                    {item.label}
                  </LinkReact>
                ))}
              </div>
              <ThemeToggle testId="theme-switcher" />
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Navbar */}
      <div className="navbar fixed top-0 z-60 md:hidden" data-testid="navbar-mobile">
        <Container className="flex justify-between">
          <div className="navbar-start">
            <LinkReact href="/" className="btn btn-ghost p-1">
              <Brand />
            </LinkReact>
          </div>
          <div className="navbar-end">
            <ThemeToggle testId="theme-switcher" />
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost bg-base-100/10" aria-label="Open menu">
                <LuMenu size={24} />
              </label>
              <ul
                tabIndex={0}
                className="menu menu-lg dropdown-content soft-glass mt-5 block w-42 rounded-lg p-2 shadow-sm"
              >
                {items.map((item) => (
                  <li key={item.label}>
                    <LinkReact
                      href={item.href}
                      className="btn btn-ghost items-center justify-start gap-3 text-lg"
                    >
                      {item.label}
                    </LinkReact>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
