import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

export type SlidePosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type AnimationDirection = "up" | "down" | "left" | "right" | "fade";

export interface SlideConfig {
  image?: string;
  title?: string;
  description?: string;
  position?: SlidePosition;
  customComponent?: React.ReactNode;
  delay?: number; // Additional delay in milliseconds for this slide
}

interface SlideshowComplexProps {
  slides: SlideConfig[];
  className?: string;
  interval?: number;
  overlayClassName?: string;
}

interface SlideshowTextProps {
  title: string;
  description: string;
  textAlign?: "left" | "center" | "right";
}

function SlideshowText({ title, description, textAlign = "center" }: SlideshowTextProps) {
  const alignmentClass =
    textAlign === "left" ? "text-left" : textAlign === "right" ? "text-right" : "text-center";

  return (
    <div className={alignmentClass}>
      <h2 className="text-6xl font-bold text-white drop-shadow-lg md:text-8xl">{title}</h2>
      <p className="mt-4 text-2xl text-white/90 drop-shadow md:text-3xl">{description}</p>
    </div>
  );
}

const getPositionClasses = (position: SlidePosition = "center") => {
  const positionMap = {
    "top-left": "items-start justify-start",
    "top-center": "items-start justify-center",
    "top-right": "items-start justify-end",
    "center-left": "items-center justify-start",
    center: "items-center justify-center",
    "center-right": "items-center justify-end",
    "bottom-left": "items-end justify-start",
    "bottom-center": "items-end justify-center",
    "bottom-right": "items-end justify-end",
  };
  return positionMap[position];
};

const getTextAlignFromPosition = (
  position: SlidePosition = "center",
): "left" | "center" | "right" => {
  if (position.includes("left")) return "left";
  if (position.includes("right")) return "right";
  return "center";
};

const getAnimationFromPosition = (position: SlidePosition = "center"): AnimationDirection => {
  // Animations that make sense based on position
  const animationMap: Record<SlidePosition, AnimationDirection> = {
    "top-left": "down",
    "top-center": "down",
    "top-right": "down",
    "center-left": "right",
    center: "fade",
    "center-right": "left",
    "bottom-left": "up",
    "bottom-center": "up",
    "bottom-right": "up",
  };
  return animationMap[position];
};

const getGradientClasses = (position: SlidePosition = "center") => {
  const gradientMap = {
    "top-left": "bg-gradient-to-br from-black/60 via-transparent to-transparent",
    "top-center": "bg-gradient-to-b from-black/60 via-transparent to-transparent",
    "top-right": "bg-gradient-to-bl from-black/60 via-transparent to-transparent",
    "center-left": "bg-gradient-to-r from-black/60 via-transparent to-transparent",
    center:
      "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/60 via-transparent to-transparent",
    "center-right": "bg-gradient-to-l from-black/60 via-transparent to-transparent",
    "bottom-left": "bg-gradient-to-tr from-black/60 via-transparent to-transparent",
    "bottom-center": "bg-gradient-to-t from-black/60 via-transparent to-transparent",
    "bottom-right": "bg-gradient-to-tl from-black/60 via-transparent to-transparent",
  };
  return gradientMap[position];
};

const getAnimationVariants = (direction: AnimationDirection = "fade") => {
  const variants = {
    up: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -50, opacity: 0 },
    },
    down: {
      initial: { y: -50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 50, opacity: 0 },
    },
    left: {
      initial: { x: 50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -50, opacity: 0 },
    },
    right: {
      initial: { x: -50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 50, opacity: 0 },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  };
  return variants[direction];
};

export default function SlideshowComplex({
  slides,
  className = "",
  interval = 5000,
  overlayClassName = "",
}: SlideshowComplexProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload all images
  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.image) {
        const img = new Image();
        img.src = slide.image;
      }
    });
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1) return;

    // Calculate the total duration for the current slide
    const currentSlide = slides[currentIndex];
    const slideDuration = interval + (currentSlide.delay || 0);

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [slides, currentIndex, interval]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className={`relative h-full w-full overflow-hidden bg-black ${className}`}>
      {/* Render all images in layers */}
      {slides.map((slide, index) => (
        <motion.div
          key={`slide-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slide.customComponent ? (
            <>{slide.customComponent}</>
          ) : (
            <>
              <img src={slide.image} alt="Slideshow image" className="h-full w-full object-cover" />
              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
            </>
          )}
        </motion.div>
      ))}

      {/* Corner gradient overlay */}
      {!currentSlide.customComponent && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`gradient-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className={`absolute inset-0 ${getGradientClasses(currentSlide.position)}`}
          />
        </AnimatePresence>
      )}

      {/* Overlay content with animations */}
      {!currentSlide.customComponent && currentSlide.title && (
        <AnimatePresence mode="wait">
          <div
            key={`overlay-container-${currentIndex}`}
            className={`absolute inset-0 flex p-12 pb-20 md:p-20 md:pb-24 ${getPositionClasses(
              currentSlide.position,
            )} ${overlayClassName}`}
          >
            <motion.div
              {...getAnimationVariants(getAnimationFromPosition(currentSlide.position))}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            >
              <SlideshowText
                title={currentSlide.title}
                description={currentSlide.description || ""}
                textAlign={getTextAlignFromPosition(currentSlide.position)}
              />
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-white" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
