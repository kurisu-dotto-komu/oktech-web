import Brand from "@/components/Common/Brand";
import Container from "@/components/Common/Container";
import MainMenu from "@/components/Common/MainMenu";
import SocialsFooter from "@/components/Common/SocialsFooter";
import { SITE } from "@/constants";
import { formatDate } from "@/utils/formatDate";
import { meta } from "@/utils/meta";

import LinkReact from "./LinkReact";
import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content" data-testid="footer">
      <Container className="flex flex-col gap-8 py-10 sm:gap-4">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <MainMenu variant="footer" />
          <div className="flex items-center gap-4">
            <SocialsFooter />
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-baseline">
          <div className="text-xs">
            <a
              href={`${meta.repository}/commit/${meta.commitHash}`}
              target="_blank"
              className="link link-hover"
            >
              Built with <code className="badge badge-xs">{`<3`}</code> on{" "}
              <code className="badge badge-xs">{meta.commitHash.substring(0, 7)}</code> at{" "}
              <code className="badge badge-xs">{formatDate(new Date(), "datetime")} UTC</code>
            </a>
          </div>
        </div>
        <div className="text-xs">
          Copyright © {new Date().getFullYear()} {SITE.shortName} {SITE.longName}
        </div>
        <div className="text-xs">
          <LinkReact href="/code-of-conduct" className="link link-hover">
            Code of Conduct
          </LinkReact>
        </div>
        <ThemeToggle testId="theme-switcher" />
      </Container>
    </footer>
  );
}
