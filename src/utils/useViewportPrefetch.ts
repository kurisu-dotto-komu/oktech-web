import { useEffect, useRef } from "react";

/**
 * Hook that prefetches a URL when its element enters the viewport
 * @param url - The URL to prefetch
 * @param enabled - Whether prefetching is enabled (default: true)
 */
export function useViewportPrefetch(url: string, enabled = true) {
  const elementRef = useRef<HTMLAnchorElement>(null);
  const prefetchedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !elementRef.current || prefetchedRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !prefetchedRef.current) {
            prefetchedRef.current = true;
            
            // Prefetch the page
            const link = document.createElement("link");
            link.rel = "prefetch";
            link.href = url;
            link.as = "document";
            document.head.appendChild(link);
            
            // Also prefetch as fetch for better browser support
            if ("requestIdleCallback" in window) {
              requestIdleCallback(() => {
                fetch(url, { 
                  method: "GET",
                  credentials: "same-origin",
                  mode: "no-cors"
                }).catch(() => {
                  // Ignore prefetch errors
                });
              });
            }
          }
        });
      },
      {
        // Start prefetching when element is 50px away from viewport
        rootMargin: "50px",
        threshold: 0
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [url, enabled]);

  return elementRef;
}

/**
 * Hook that prefetches multiple URLs in a batch when elements enter viewport
 * Useful for lists of items
 */
export function useBatchViewportPrefetch() {
  const prefetchedUrls = useRef(new Set<string>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const url = (entry.target as HTMLAnchorElement).href;
            if (url && !prefetchedUrls.current.has(url)) {
              prefetchedUrls.current.add(url);
              
              // Prefetch the page
              const link = document.createElement("link");
              link.rel = "prefetch";
              link.href = url;
              link.as = "document";
              document.head.appendChild(link);
              
              // Also use fetch API for better support
              if ("requestIdleCallback" in window) {
                requestIdleCallback(() => {
                  fetch(url, { 
                    method: "GET",
                    credentials: "same-origin",
                    mode: "no-cors"
                  }).catch(() => {
                    // Ignore prefetch errors
                  });
                });
              }
            }
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const observeElement = (element: HTMLAnchorElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  const unobserveElement = (element: HTMLAnchorElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
    }
  };

  return { observeElement, unobserveElement };
}