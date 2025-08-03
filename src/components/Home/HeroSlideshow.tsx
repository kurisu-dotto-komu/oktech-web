import SlideshowComplex, { type SlideConfig } from "@/components/Common/SlideshowComplex";

const slides: SlideConfig[] = [
  {
    image: "/content/events/302995505-how-to-present-and-sql/gallery/DSCF0839.webp",
    title: "Innovate",
    description: "Master cutting-edge technologies",
    position: "center-right",
  },
  {
    image:
      "/content/events/299334647-workshop-create-a-blogportfolio-in-astro-and-hygraph/gallery/IMG_9847.webp",
    title: "Collab",
    description: "Share knowledge and learn together",
    position: "bottom-right",
  },
  {
    image: "/content/events/299335046-osaka-hanami-2024/gallery/IMG_9924.webp",
    title: "Connect",
    description: "Make friends and build connections",
    position: "top-center",
  },
  {
    image: "/content/events/299830334-vim-and-noise/gallery/IMG_20240413_1728142.webp",
    title: "Learn",
    description: "Stay up to date with the latest techniques",
    position: "top-left",
  },
  {
    image: "/content/events/301456891-workshop-like-s3/gallery/IMG_7669.webp",
    title: "Grow",
    description: "Advance your career and skills",
    position: "bottom-center",
  },
  {
    image: "/content/events/297594896-end-of-2023-dinner/gallery/IMG_7856.webp",
    title: "Enjoy",
    description: "Have fun while getting good",
    position: "top-center",
  },
];

export default function HeroSlideshow() {
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
