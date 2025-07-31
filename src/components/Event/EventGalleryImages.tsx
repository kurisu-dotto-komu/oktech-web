import { useState, useEffect } from "react";
import type { EventEnriched, GalleryImage } from "@/content";
import EventImageModal from "./EventImageModal";
import { LuImage } from "react-icons/lu";

interface Props {
  event: EventEnriched;
  class?: string;
}

export default function EventGalleryImages({ event }: Props) {
  const galleryImages = event.galleryImages || [];
  const reversedImages = galleryImages.slice().reverse();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (galleryImages.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-base-200 rounded-xl">
        <div className="flex items-center gap-3 text-base-content/60">
          <LuImage className="w-6 h-6" />
          <span>This event doesn't have any images yet</span>
        </div>
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedIndex(null), 300); // Delay to allow fade out
  };

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? reversedImages.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === reversedImages.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const handleDotClick = (index: number) => {
    setSelectedIndex(index);
  };

  // Disable sticky nav keyboard shortcuts when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Dispatch event to disable sticky nav
      const event = new CustomEvent("gallery-modal-toggle", { detail: { open: true } });
      window.dispatchEvent(event);
    } else {
      // Re-enable sticky nav
      const event = new CustomEvent("gallery-modal-toggle", { detail: { open: false } });
      window.dispatchEvent(event);
    }

    return () => {
      // Ensure sticky nav is re-enabled on unmount
      const event = new CustomEvent("gallery-modal-toggle", { detail: { open: false } });
      window.dispatchEvent(event);
    };
  }, [isModalOpen]);

  const selectedImage = selectedIndex !== null ? reversedImages[selectedIndex] : null;

  return (
    <>
      {reversedImages.map((img, index) => (
        <button
          key={img.id}
          onClick={() => handleImageClick(index)}
          className="w-full focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          type="button"
          aria-label={`View larger image: ${img.data.caption ?? ""}`}
          data-testid={`gallery-image-${index}`}
        >
          <img
            src={img.thumbnailSrc}
            alt={img.data.caption ?? ""}
            className="w-full aspect-[4/3] object-cover rounded-lg hover:opacity-90 transition-opacity bg-base-300 cursor-pointer"
            loading="lazy"
            width={320}
            height={240}
          />
        </button>
      ))}
      {selectedImage && (
        <EventImageModal
          allImages={galleryImages}
          isOpen={isModalOpen}
          imageSrc={selectedImage.fullSrc}
          altText={selectedImage.data.caption ?? ""}
          eventTitle={event.data.title}
          onClose={handleCloseModal}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onDotClick={handleDotClick}
          currentIndex={selectedIndex ?? 0}
          totalImages={reversedImages.length}
        />
      )}
    </>
  );
}
