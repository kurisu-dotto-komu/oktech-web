import Socials from "@/components/Common/Socials";
import Container from "@/components/Common/Container";
import MainMenu from "@/components/Common/MainMenu";
import { formatDate } from "@/utils/formatDate";
import Brand from "@/components/Common/Brand";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { meta } from "@/utils/meta";

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
      </Container>
    </footer>
  );
}
