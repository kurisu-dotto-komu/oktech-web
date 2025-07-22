import { useEffect, useState } from "react";
import { DEV_MODE } from "@/config";

export default function DevInfo() {
  const [metaTags, setMetaTags] = useState<string>("");
  const [ogImageUrl, setOgImageUrl] = useState<string>("");
  const [ogImageError, setOgImageError] = useState(false);

  useEffect(() => {
    function updateDevInfo() {
      // Get all meta tags
      const metaTagsElements = document.querySelectorAll("head meta");

      let metaHTML = "";
      metaTagsElements.forEach((tag) => {
        const attrs = Array.from(tag.attributes)
          .map((attr) => `${attr.name}="${attr.value}"`)
          .join(" ");
        metaHTML += `<meta ${attrs} />`;
      });
      setMetaTags(metaHTML || "No meta tags found");

      // Get OG image
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogUrl = ogImage?.getAttribute("content") || "";
      setOgImageUrl(ogUrl);
      setOgImageError(false);
    }

    // Run on mount
    updateDevInfo();

    // Also update on navigation for SPA behavior
    const handlePageLoad = () => updateDevInfo();
    document.addEventListener("astro:page-load", handlePageLoad);

    return () => {
      document.removeEventListener("astro:page-load", handlePageLoad);
    };
  }, []);

  // Only render if in dev mode
  if (!DEV_MODE) return null;

  return (
    <div className="bg-base-300 border-t-4 border-warning">
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <span className="font-bold">DEV MODE</span> - This section is only visible in development
        </div>

        <div className="space-y-8">
          {/* Meta Tags Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                ></path>
              </svg>
              Meta Tags
            </h3>
            <div className="mockup-code">
              <pre className="text-xs text-success">
                <code>
                  {metaTags.split("<meta").map((tag, i) =>
                    i === 0 ? (
                      tag
                    ) : (
                      <div key={i} data-prefix=">" className="text-success">
                        {"<meta" + tag}
                      </div>
                    ),
                  )}
                </code>
              </pre>
            </div>
          </div>

          {/* OG Image Preview Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              OG Image Preview
            </h3>
            <div className="grid gap-6">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h4 className="card-title text-lg">Open Graph Image</h4>
                  <div className="mt-4">
                    {ogImageUrl && !ogImageError ? (
                      <img
                        src={ogImageUrl}
                        alt="OG Image Preview"
                        className="rounded-lg shadow-lg max-w-full"
                        onError={() => setOgImageError(true)}
                      />
                    ) : ogImageError ? (
                      <div className="alert alert-error">Failed to load OG image</div>
                    ) : (
                      <div className="skeleton h-[315px] w-full max-w-[600px] mx-auto"></div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm opacity-70 mb-2">Image URL:</p>
                    <div className="mockup-code">
                      <pre className="text-xs">
                        <code>{ogImageUrl || "No OG image specified"}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
