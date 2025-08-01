import { useEffect, useRef, useMemo } from "react";
import { LuX, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { GalleryImage } from "@/content";

interface Props {
  isOpen: boolean;
  imageSrc: string;
  altText: string;
  eventTitle: string;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
  currentIndex: number;
  totalImages: number;
  allImages: GalleryImage[];
}

export default function EventImageModal({
  isOpen,
  imageSrc,
  altText,
  eventTitle,
  onClose,
  onPrevious,
  onNext,
  onDotClick,
  currentIndex,
  totalImages,
  allImages,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const transformComponentRef = useRef<any>(null);

  // Calculate previous and next image URLs for prefetching
  const { prevImageUrl, nextImageUrl } = useMemo(() => {
    const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
    const nextIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;

    return {
      prevImageUrl: allImages[prevIndex]?.fullSrc,
      nextImageUrl: allImages[nextIndex]?.fullSrc,
    };
  }, [currentIndex, totalImages, allImages]);

  // Prefetch previous and next images
  useEffect(() => {
    if (!isOpen) return;

    const preloadImage = (src: string) => {
      // Create image element for browser caching
      const img = new Image();
      img.src = src;

      // Also add link preload for higher priority
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);

      // Cleanup function to remove link
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    };

    const cleanups: (() => void)[] = [];

    if (prevImageUrl) {
      const cleanup = preloadImage(prevImageUrl);
      if (cleanup) cleanups.push(cleanup);
    }

    if (nextImageUrl) {
      const cleanup = preloadImage(nextImageUrl);
      if (cleanup) cleanups.push(cleanup);
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [isOpen, prevImageUrl, nextImageUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext]);

  // Reset zoom when modal closes or image changes
  useEffect(() => {
    if (!isOpen || !transformComponentRef.current) return;
    transformComponentRef.current.resetTransform();
  }, [isOpen, imageSrc]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${isOpen ? "modal-open" : ""} transition-opacity duration-300`}
      style={{ opacity: isOpen ? 1 : 0 }}
      onClick={(e) => {
        // Close modal if clicked outside content
        if (e.target === e.currentTarget || e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-8 z-50" onClick={(e) => {
        // Also handle clicks on the container
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
        <div className="flex flex-col items-center w-full max-w-[90vw] lg:max-w-[80vw] xl:max-w-[1200px]">
          {/* Header with title and close button - aligned with modal box */}
          <div className="w-full flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-semibold text-white drop-shadow-lg">{eventTitle}</h3>
            <button
              className="p-2 text-white hover:text-white/80 transition-colors cursor-pointer"
              onClick={onClose}
              aria-label="Close modal"
            >
              <LuX size={24} />
            </button>
          </div>

          {/* Container for modal box and navigation arrows */}
          <div className="relative w-full flex items-center">
            {/* Left navigation arrow - outside box */}
            <button
              className="absolute -left-12 sm:-left-16 p-2 text-white hover:text-white/80 transition-colors z-20 cursor-pointer"
              onClick={onPrevious}
              aria-label="Previous image"
            >
              <LuChevronLeft size={32} />
            </button>

            {/* Right navigation arrow - outside box */}
            <button
              className="absolute -right-12 sm:-right-16 p-2 text-white hover:text-white/80 transition-colors z-20 cursor-pointer"
              onClick={onNext}
              aria-label="Next image"
            >
              <LuChevronRight size={32} />
            </button>

            {/* Modal box with image */}
            <div className="w-full max-w-[90vw] lg:max-w-[80vw] xl:max-w-[1200px] rounded-lg overflow-hidden">
              {/* Image container */}
              <div className="relative bg-black">
                <TransformWrapper
                  ref={transformComponentRef}
                  minScale={1}
                  maxScale={5}
                  initialScale={1}
                  centerOnInit={true}
                  limitToBounds={true}
                  doubleClick={{ mode: "reset" }}
                  panning={{ disabled: false }}
                  pinch={{ disabled: false }}
                  wheel={{ disabled: false }}
                  alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
                  centerZoomedOut={true}
                >
                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height: "auto",
                    }}
                    contentStyle={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={altText}
                      className="w-full h-auto max-h-[75vh] object-contain"
                      style={{ userSelect: "none" }}
                      draggable={false}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>

              {/* Caption */}
              {altText && (
                <div className="p-4 bg-base-100">
                  <p className="text-sm text-base-content/70">{altText}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation dots - outside modal box */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: totalImages }).map((_, index) => (
              <button
                key={index}
                onClick={() => onDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  index === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/80 backdrop-blur-sm fixed inset-0">
        <button type="button" onClick={onClose} className="cursor-pointer w-full h-full" aria-label="Close modal">
          <span className="sr-only">close</span>
        </button>
      </form>
    </dialog>
  );
}
