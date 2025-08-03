import SlideshowComplex, { type SlideConfig } from "@/components/Common/SlideshowComplex";

import HeroSlideLanding from "./HeroSlideLanding";

interface HeroSlideshowProps {
  slides: SlideConfig[];
}

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  // Add the custom landing slide at the end with a 2-second delay
  const allSlides = [...slides, { customComponent: <HeroSlideLanding />, delay: 2000 }];
  return (
    <div data-testid="hero-slideshow" className="flex w-full justify-center">
      <div
        className="relative w-full"
        style={{
          aspectRatio: "4/3",
          maxHeight: "80vh",
          maxWidth: "calc(80vh * 4 / 3)",
        }}
      >
        <SlideshowComplex
          slides={allSlides}
          className="absolute inset-0"
          overlayClassName="bg-gradient-to-t from-black/50 to-transparent"
          interval={4000}
        />
      </div>
    </div>
  );
}
