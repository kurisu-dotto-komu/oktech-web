import "@/styles/animations.css";

import React, { useEffect, useState } from "react";

import { BLOBS } from "@/utils/blobs";

interface ImageData {
  src: string;
  srcSet?: string;
  sizes?: string;
}

interface BlobSlideshowProps<T = string | ImageData> {
  images?: (string | ImageData)[];
  data?: T[];
  renderer?: (item: T, index: number) => React.ReactNode;
  transitionSpeed?: number; // milliseconds for blob morph
  slideDelay?: number; // milliseconds between slides
  className?: string;
  blobs?: string[];
  containerClassName?: string;
  blobOffset?: number; // optional offset for starting blob index
  startTimeOffset?: number; // optional delay before starting transitions (milliseconds)
}

export default function BlobSlideshow<T = string | ImageData>({
  images,
  data,
  renderer,
  transitionSpeed = 1000,
  slideDelay = 2000,
  className = "",
  blobs = BLOBS,
  containerClassName = "",
  blobOffset = 0,
  startTimeOffset = 0,
}: BlobSlideshowProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBlob, setCurrentBlob] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Determine which mode we're in
  const items = data || images || [];
  const isDataMode = !!data && !!renderer;

  // Use Intersection Observer to detect when slideshow is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Lazy load current image and prefetch next image only
  useEffect(() => {
    if (!isDataMode && images && isVisible) {
      // Load current image
      if (!loadedImages.has(currentIndex)) {
        const image = images[currentIndex];
        const img = new Image();
        img.src = typeof image === "string" ? image : image.src;
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(currentIndex));
        };
      }

      // Prefetch only the next image
      const nextIndex = (currentIndex + 1) % images.length;
      if (!loadedImages.has(nextIndex)) {
        const nextImage = images[nextIndex];
        const img = new Image();
        img.src = typeof nextImage === "string" ? nextImage : nextImage.src;
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(nextIndex));
        };
      }
    }
  }, [currentIndex, images, isDataMode, isVisible, loadedImages]);

  // Synchronize slide and blob transitions
  useEffect(() => {
    if (items.length <= 1 || !isVisible) return;

    let intervalTimer: NodeJS.Timeout;

    // Reason: Delay the start of transitions if startTimeOffset is provided
    const startTimer = setTimeout(() => {
      intervalTimer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        // Reason: Loop through same number of blobs as items to maintain 1:1 correspondence
        setCurrentBlob((prev) => (prev + 1) % items.length);
      }, slideDelay);
    }, startTimeOffset);

    return () => {
      clearTimeout(startTimer);
      if (intervalTimer) clearInterval(intervalTimer);
    };
  }, [items.length, slideDelay, startTimeOffset, isVisible]);

  if (items.length === 0) return null;

  // Create unique mask ID to avoid conflicts
  const maskId = `blob-mask-${React.useId()}`;

  return (
    <div
      ref={containerRef}
      className={`relative z-10 h-full w-full ${containerClassName || "aspect-[4/3]"}`}
    >
      <div className="absolute inset-0 -mx-20 -my-10 md:-mx-16 md:-my-16 lg:-mx-12 lg:-my-12">
        <svg width={0} height={0}>
          <defs>
            <mask
              id={maskId}
              maskUnits="objectBoundingBox"
              maskContentUnits="objectBoundingBox"
              x="0"
              y="0"
              width="1"
              height="1"
            >
              <rect x="0" y="0" width="1" height="1" fill="black" />
              <path
                fill="white"
                transform="translate(0 0) scale(0.01)"
                d={blobs[(currentBlob + blobOffset) % blobs.length]}
                style={{ transition: `d ${transitionSpeed}ms cubic-bezier(0.68,-0.55,0.265,1.55)` }}
              />
            </mask>
          </defs>
        </svg>
        <div className={`absolute inset-0 ${className}`} style={{ mask: `url(#${maskId})` }}>
          {isDataMode
            ? // Render custom data with renderer
              data!.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-[1000ms] ${
                    index === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {renderer!(item, index)}
                </div>
              ))
            : // Render images
              images!.map((image, index) => {
                const isString = typeof image === "string";
                const src = isString ? image : image.src;
                const shouldRender = loadedImages.has(index) || index === currentIndex;

                if (!shouldRender) return null;

                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-[1000ms] ${
                      index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={src}
                      srcSet={!isString ? image.srcSet : undefined}
                      sizes={!isString ? image.sizes || "100vw" : undefined}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
