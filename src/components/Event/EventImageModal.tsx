import { useEffect, useMemo, useRef, useState } from "react";

import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import type { EventEnriched, GalleryImage } from "@/content";
import { formatDate } from "@/utils/formatDate";

interface Props {
  isOpen: boolean;
  selectedImage: GalleryImage | null;
  event: EventEnriched;
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
  selectedImage,
  event,
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
  const [isZooming, setIsZooming] = useState(false);
  const [currentScale, setCurrentScale] = useState(1);
  const [isFullImageLoaded, setIsFullImageLoaded] = useState(false);
  const [pointerStart, setPointerStart] = useState<number | null>(null);

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

    // Store preloaded images in refs to keep them in memory
    const preloadedImages: HTMLImageElement[] = [];

    const preloadImage = (src: string) => {
      // Create image element for browser caching
      const img = new Image();
      img.src = src;
      preloadedImages.push(img);

      // Also add link preload for higher priority
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = src;
      link.setAttribute("data-gallery-prefetch", "true");
      document.head.appendChild(link);
    };

    if (prevImageUrl) {
      preloadImage(prevImageUrl);
    }

    if (nextImageUrl) {
      preloadImage(nextImageUrl);
    }

    // Cleanup on modal close, not on every image change
    return () => {
      if (!isOpen) {
        // Remove prefetch links when modal closes
        const links = document.querySelectorAll('link[data-gallery-prefetch="true"]');
        links.forEach((link) => link.remove());
      }
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

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Pointer events (work for both touch and mouse)
  const onPointerDown = (e: React.PointerEvent) => {
    // Only track single touch/left mouse for swipe
    if (e.pointerType === "mouse" && e.button !== 0) return;
    
    // Don't interfere with pinch-to-zoom (multi-touch)
    if (e.isPrimary) {
      setPointerStart(e.clientX);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    // Intentionally empty - we only care about start and end positions
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStart === null || !e.isPrimary) return;
    
    const pointerEnd = e.clientX;
    
    // Don't trigger swipe if we're zoomed in or currently zooming
    if (currentScale > 1 || isZooming) {
      setPointerStart(null);
      return;
    }

    const distance = pointerStart - pointerEnd;
    
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrevious();
    }
    
    setPointerStart(null);
  };

  const onPointerCancel = () => {
    setPointerStart(null);
  };

  // Reset zoom when modal closes or image changes
  useEffect(() => {
    if (!isOpen || !transformComponentRef.current) return;
    transformComponentRef.current.resetTransform();
    setCurrentScale(1);
  }, [isOpen, selectedImage]);

  // Reset full image loaded state when image changes
  useEffect(() => {
    setIsFullImageLoaded(false);
  }, [selectedImage]);

  if (!isOpen || !selectedImage) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${isOpen ? "modal-open" : ""} transition-opacity duration-300`}
      style={{ opacity: isOpen ? 1 : 0 }}
      data-testid="image-modal"
      onClick={(e) => {
        // Close modal if clicked outside content
        if (e.target === e.currentTarget || e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
        onClick={(e) => {
          // Also handle clicks on the container
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="flex w-full max-w-[80vw] flex-col items-center text-white lg:max-w-[80vw] xl:max-w-[1200px]">
          {/* Header with title and close button - aligned with modal box */}
          <div className="mb-4 flex w-full items-end justify-between px-1">
            <div className="flex flex-wrap-reverse items-baseline gap-4">
              <h3 className="text-lg font-semibold drop-shadow-lg">{event.data.title} </h3>
              <span className="text-base font-normal">
                {formatDate(event.data.dateTime, "long")}
              </span>
            </div>
            <button
              className="cursor-pointer p-2 text-white transition-colors hover:text-white/80"
              onClick={onClose}
              aria-label="Close modal"
            >
              <LuX size={24} />
            </button>
          </div>

          {/* Container for modal box and navigation arrows */}
          <div className="relative flex w-full items-center">
            {/* Left navigation arrow - outside box */}
            <button
              className="absolute -left-12 z-20 cursor-pointer p-2 text-white transition-colors hover:text-white/80 sm:-left-16"
              onClick={onPrevious}
              aria-label="Previous image"
            >
              <LuChevronLeft size={32} />
            </button>

            {/* Right navigation arrow - outside box */}
            <button
              className="absolute -right-12 z-20 cursor-pointer p-2 text-white transition-colors hover:text-white/80 sm:-right-16"
              onClick={onNext}
              aria-label="Next image"
            >
              <LuChevronRight size={32} />
            </button>

            {/* Modal box with image */}
            <div className="rounded-box w-full max-w-[90vw] overflow-hidden lg:max-w-[80vw] xl:max-w-[1200px]">
              {/* Image container */}
              <div
                className="relative aspect-[3/4] bg-black sm:aspect-square md:aspect-[4/3]"
              >
                {/* Swipe detection overlay - only when not zoomed */}
                {currentScale === 1 && !isZooming && (
                  <div
                    className="absolute inset-0 z-10"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerCancel}
                    style={{ pointerEvents: "auto" }}
                  />
                )}
                <TransformWrapper
                  ref={transformComponentRef}
                  minScale={1}
                  maxScale={6}
                  centerOnInit={true}
                  limitToBounds={true}
                  doubleClick={{ mode: "reset" }}
                  panning={{ disabled: false }}
                  pinch={{ disabled: false }}
                  wheel={{ disabled: false }}
                  alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
                  centerZoomedOut={true}
                  onTransformed={(_, state) => {
                    setCurrentScale(state.scale);
                  }}
                  onZoomStart={() => {
                    setIsZooming(true);
                  }}
                  onZoomStop={() => {
                    setIsZooming(false);
                  }}
                >
                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
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
                      src={isFullImageLoaded ? selectedImage.fullSrc : selectedImage.thumbnailSrc}
                      alt={selectedImage.data.caption ?? ""}
                      className="h-full w-full object-contain"
                      style={{ userSelect: "none" }}
                      draggable={false}
                      data-testid="modal-main-image"
                    />
                    {/* Hidden preloader for full image */}
                    {!isFullImageLoaded && (
                      <img
                        src={selectedImage.fullSrc}
                        alt=""
                        className="absolute h-0 w-0 opacity-0"
                        onLoad={() => setIsFullImageLoaded(true)}
                        aria-hidden="true"
                      />
                    )}
                  </TransformComponent>
                </TransformWrapper>

                {/* Caption overlay */}
                {selectedImage.data.caption && (
                  <div className="rounded-box absolute bottom-2 left-1/2 max-w-[90%] -translate-x-1/2 transform bg-black/80 px-4 py-2 backdrop-blur-sm">
                    <p data-testid="modal-image-caption" className="text-center text-sm text-white">
                      {selectedImage.data.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation dots - outside modal box */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {Array.from({ length: totalImages }).map((_, index) => (
              <button
                key={index}
                onClick={() => onDotClick(index)}
                className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-white" : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <form
        method="dialog"
        className="modal-backdrop fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={onClose}
          className="h-full w-full cursor-pointer"
          aria-label="Close modal"
        >
          <span className="sr-only">close</span>
        </button>
      </form>
    </dialog>
  );
}
