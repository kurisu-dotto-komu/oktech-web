import { useState, useEffect } from "react";
import type { EventEnriched, GalleryImage } from "@/content";
import EventImageModal from "./EventImageModal";

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
    return null;
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
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < reversedImages.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
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
          isOpen={isModalOpen}
          imageSrc={selectedImage.fullSrc}
          altText={selectedImage.data.caption ?? ""}
          onClose={handleCloseModal}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={selectedIndex !== null && selectedIndex > 0}
          hasNext={selectedIndex !== null && selectedIndex < reversedImages.length - 1}
        />
      )}
    </>
  );
}
