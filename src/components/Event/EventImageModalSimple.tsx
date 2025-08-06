import { useEffect, useMemo, useRef, useState } from "react";

import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";

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
  const [isFullImageLoaded, setIsFullImageLoaded] = useState(false);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const isDragging = useRef(false);

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

    const preloadedImages: HTMLImageElement[] = [];

    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
      preloadedImages.push(img);
    };

    if (prevImageUrl) {
      preloadImage(prevImageUrl);
    }

    if (nextImageUrl) {
      preloadImage(nextImageUrl);
    }
  }, [isOpen, prevImageUrl, nextImageUrl]);

  // Handle keyboard navigation
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

  // Reset full image loaded state when image changes
  useEffect(() => {
    setIsFullImageLoaded(false);
    if (selectedImage) {
      const img = new Image();
      img.src = selectedImage.fullSrc;
      img.onload = () => setIsFullImageLoaded(true);
    }
  }, [selectedImage]);

  // Handle both touch and mouse events for swipe/drag navigation
  const handlePointerStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    startX.current = clientX;
    startY.current = clientY;
    isDragging.current = true;
    
    // Prevent text selection during drag
    if (!('touches' in e)) {
      e.preventDefault();
    }
  };

  const handlePointerEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX.current === null || startY.current === null || !isDragging.current) return;

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    
    const deltaX = clientX - startX.current;
    const deltaY = clientY - startY.current;
    
    // Only trigger swipe if horizontal movement is greater than vertical
    // and the swipe distance is significant (more than 50px)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - go to previous image
        onPrevious();
      } else {
        // Swipe left - go to next image
        onNext();
      }
    }
    
    startX.current = null;
    startY.current = null;
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    // Reset if mouse leaves the area while dragging
    startX.current = null;
    startY.current = null;
    isDragging.current = false;
  };

  // Calculate which dots to show (max 10)
  const maxDots = 10;
  const dotsToShow = Math.min(totalImages, maxDots);
  const halfDots = Math.floor(dotsToShow / 2);
  
  let startDot = 0;
  let endDot = totalImages;
  
  if (totalImages > maxDots) {
    if (currentIndex < halfDots) {
      // Near the beginning
      startDot = 0;
      endDot = maxDots;
    } else if (currentIndex >= totalImages - halfDots) {
      // Near the end
      startDot = totalImages - maxDots;
      endDot = totalImages;
    } else {
      // In the middle
      startDot = currentIndex - halfDots;
      endDot = currentIndex + halfDots + (dotsToShow % 2);
    }
  }

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
        <div className="flex w-full max-w-[90vw] flex-col items-center text-white lg:max-w-[80vw] xl:max-w-[1200px]">
          {/* Header with title and close button */}
          <div className="mb-4 flex w-full items-end justify-between px-1">
            <div className="flex flex-wrap-reverse items-baseline gap-4">
              <h3 className="text-lg font-semibold drop-shadow-lg">{event.data.title}</h3>
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
            {/* Left navigation arrow */}
            <button
              className="absolute -left-12 z-20 cursor-pointer p-2 text-white transition-colors hover:text-white/80 sm:-left-16"
              onClick={onPrevious}
              aria-label="Previous image"
            >
              <LuChevronLeft size={32} />
            </button>

            {/* Right navigation arrow */}
            <button
              className="absolute -right-12 z-20 cursor-pointer p-2 text-white transition-colors hover:text-white/80 sm:-right-16"
              onClick={onNext}
              aria-label="Next image"
            >
              <LuChevronRight size={32} />
            </button>

            {/* Modal box with image - simple version without zoom */}
            <div className="rounded-box w-full overflow-hidden">
              {/* Image container with touch and mouse handlers */}
              <div 
                className="relative flex aspect-[3/4] items-center justify-center bg-black sm:aspect-square md:aspect-[4/3] cursor-grab active:cursor-grabbing"
                onTouchStart={handlePointerStart}
                onTouchEnd={handlePointerEnd}
                onMouseDown={handlePointerStart}
                onMouseUp={handlePointerEnd}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={isFullImageLoaded ? selectedImage.fullSrc : selectedImage.thumbnailSrc}
                  alt={selectedImage.data.caption ?? ""}
                  className="h-full w-full object-contain select-none pointer-events-none"
                  data-testid="modal-main-image"
                  draggable={false}
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

          {/* Navigation dots with sliding window */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {totalImages > maxDots && startDot > 0 && (
              <span className="text-white/50 text-sm">...</span>
            )}
            {Array.from({ length: endDot - startDot }).map((_, i) => {
              const index = startDot + i;
              return (
                <button
                  key={index}
                  onClick={() => onDotClick(index)}
                  className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-white" : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              );
            })}
            {totalImages > maxDots && endDot < totalImages && (
              <span className="text-white/50 text-sm">...</span>
            )}
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