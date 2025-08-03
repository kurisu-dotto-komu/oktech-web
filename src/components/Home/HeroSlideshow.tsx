import SlideshowComplex, { type SlideConfig } from "@/components/Common/SlideshowComplex";

interface HeroSlideshowProps {
  slides: SlideConfig[];
}

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
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
          slides={slides}
          className="absolute inset-0"
          overlayClassName="bg-gradient-to-t from-black/50 to-transparent"
          interval={4000}
        />
      </div>
    </div>
  );
}
