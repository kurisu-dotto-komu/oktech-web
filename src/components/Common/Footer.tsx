import Socials from "@/components/Common/Socials";
import Container from "@/components/Common/Container";
import MainMenu from "@/components/Common/MainMenu";
import { formatDate } from "@/utils/formatDate";
import Brand from "@/components/Common/Brand";
import ThemeToggle from "@/components/Common/ThemeToggle";

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content">
      <Container className="flex flex-col py-10 gap-8 sm:gap-4">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-8">
          <MainMenu variant="footer" />
          <div className="flex gap-4 items-center">
            <Socials variant="footer" />
            {/* <ThemeToggle testId="theme-toggle-footer" /> */}
          </div>
        </div>
        <div className="flex justify-between items-center sm:items-baseline flex-col sm:flex-row gap-8">
          <div className="opacity-80">
            <Brand fullText neutral />
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
