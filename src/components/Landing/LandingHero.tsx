import Hero from "@/components/Common/Hero";
import Brand from "@/components/Common/Brand";

export default function LandingHero() {
  return (
    <Hero shader>
      <div className="flex flex-col gap-20">
        <Brand big />
        <div className="bg-base-100/50 w-full flex justify-center text-center p-14 border-base-100/50 border-x-0 border-1">
          <div className="text-base-content max-w-xl text-pretty flex flex-col gap-10 text-lg text-shadow-sm text-shadow-base-100/10">
            <h2 className="text-2xl" data-testid="landing-hero-title">
              Welcome to the homepage of <br />
              Osaka Kyoto Technology Meetup Group
            </h2>
            <p>
              We are a vibrant community of web developers, designers, and tech enthusiasts. We meet
              regularly to share knowledge, learn new skills, and network with other professionals
              in the Kansai region.
            </p>
            <p className="font-header text-2xl">Come and join us at our next event!</p>
          </div>
        </div>
      </div>
    </Hero>
  );
}
