import { MENU } from "@/constants";
import Container from "@/components/Common/Container";
import LinkReact from "@/components/Common/LinkReact";
import Brand from "@/components/Common/Brand";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { LuMenu } from "react-icons/lu";

export default function TopBar() {
  const items = MENU.filter((item) => item.header !== false);

  return (
    <>
      <div className="fixed top-0 z-50 shadow-sm soft-glass navbar" data-testid="navbar">
        <Container className="hidden md:flex justify-between">
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
                    className="btn btn-ghost gap-3 text-lg items-center justify-start"
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
      <div className="fixed top-0 navbar z-60 md:hidden" data-testid="navbar-mobile">
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
                className="menu menu-lg dropdown-content mt-5 p-2 soft-glass shadow-sm w-42 block rounded-lg"
              >
                {items.map((item) => (
                  <li key={item.label}>
                    <LinkReact
                      href={item.href}
                      className="btn btn-ghost gap-3 text-lg items-center justify-start"
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
    </>
  );
}
