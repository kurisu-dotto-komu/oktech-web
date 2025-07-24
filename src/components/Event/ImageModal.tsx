import { useEffect, useRef } from "react";
import { LuX, LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface Props {
  isOpen: boolean;
  imageSrc: string;
  altText: string;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export default function ImageModal({
  isOpen,
  imageSrc,
  altText,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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
          if (hasPrevious && onPrevious) onPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          if (hasNext && onNext) onNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${isOpen ? "modal-open" : ""} transition-opacity duration-300`}
      style={{ opacity: isOpen ? 1 : 0 }}
    >
      <div className="modal-box max-w-5xl p-0 relative">
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            aria-label="Close modal"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="flex items-center">
          {hasPrevious && onPrevious && (
            <button
              className="absolute left-2 z-10 btn btn-circle btn-ghost"
              onClick={onPrevious}
              aria-label="Previous image"
            >
              <LuChevronLeft size={24} />
            </button>
          )}

          <figure className="relative w-full">
            <img
              src={imageSrc}
              alt={altText}
              className="w-full h-auto max-h-[80vh] object-contain transition-opacity duration-300"
            />
            {altText && (
              <figcaption className="p-4 bg-base-100">
                <p className="text-sm text-base-content/70">{altText}</p>
              </figcaption>
            )}
          </figure>

          {hasNext && onNext && (
            <button
              className="absolute right-2 z-10 btn btn-circle btn-ghost"
              onClick={onNext}
              aria-label="Next image"
            >
              <LuChevronRight size={24} />
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
