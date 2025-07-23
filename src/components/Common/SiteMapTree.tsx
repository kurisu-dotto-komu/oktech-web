import Link from "@/components/Common/LinkReact";
import { getOGImageWithFallback } from "@/utils/og";
import { buildSitemapSections, type PageEntry, type SectionEntry } from "@/utils/sitemap";

// The sections promise will resolve once and remain cached for subsequent renders.
const sectionsPromise = buildSitemapSections();
const sections: SectionEntry[] = await sectionsPromise;

interface Props {
  className?: string;
  showOGImages?: boolean;
}

/**
 * Render a section with optional link and children
 */
function Section({
  section,
  showOGImages = false,
}: {
  section: SectionEntry;
  showOGImages?: boolean;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">
        {section.href ? (
          <>
            <Link href={section.href} className="link link-hover">
              {section.title}
            </Link>
            <span className="text-sm text-base-content/50 ml-2">{section.href}</span>
          </>
        ) : (
          <span className="text-base-content/70">{section.title}</span>
        )}
      </h3>
      {showOGImages && section.href && (
        <div className="mb-4">
          <img
            src={getOGImageWithFallback(section.href)}
            alt={`OG image for ${section.title}`}
            className="w-full h-auto object-cover rounded-lg shadow-md"
            loading="lazy"
          />
        </div>
      )}
      {section.children.length > 0 && (
        <div
          className={
            showOGImages
              ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
              : "list-none space-y-1 md:ml-4"
          }
        >
          {section.children.map((child) => (
            <div key={child.href} className={showOGImages ? "flex flex-col" : ""}>
              {showOGImages && (
                <div className="mb-2">
                  <img
                    src={getOGImageWithFallback(child.href)}
                    alt={`OG image for ${child.title}`}
                    className="w-full h-auto object-cover rounded-lg shadow-md aspect-[1200/630]"
                    loading="lazy"
                  />
                </div>
              )}
              <div>
                <Link href={child.href} className="link link-hover text-sm block">
                  {child.title}
                </Link>
                <span className="text-xs text-base-content/50 break-all">{child.href}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Top-level component that renders organized sections
 */
export default function SiteMapTree({ className = "", showOGImages = false }: Props) {
  return (
    <div className={className}>
      {sections.map((section) => (
        <Section key={section.title} section={section} showOGImages={showOGImages} />
      ))}
    </div>
  );
}
