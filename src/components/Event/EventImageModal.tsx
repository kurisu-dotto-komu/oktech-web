import { useEffect, useRef } from "react";
import { LuX, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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

export default function EventImageModal({
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
  const transformComponentRef = useRef<any>(null);

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

          <figure className="relative w-full overflow-hidden">
            <TransformWrapper
              ref={transformComponentRef}
              minScale={1}
              maxScale={5}
              initialScale={1}
              centerOnInit={true}
              limitToBounds={false}
              doubleClick={{ mode: "reset" }}
              panning={{ disabled: false }}
              pinch={{ disabled: false }}
              wheel={{ disabled: false }}
            >
              <TransformComponent>
                <img
                  src={imageSrc}
                  alt={altText}
                  className="max-w-full h-auto max-h-[80vh] object-contain"
                  style={{ userSelect: "none" }}
                  draggable={false}
                />
              </TransformComponent>
            </TransformWrapper>
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
      <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
