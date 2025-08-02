import Brand from "@/components/Common/Brand";
import Hero from "@/components/Common/Hero";

export default function LandingHero() {
  return (
    <Hero shader>
      <div className="flex flex-col gap-20">
        <Brand big />
        <div className="bg-base-100/50 border-base-100/50 flex w-full justify-center border-1 border-x-0 p-14 text-center">
          <div className="text-base-content text-shadow-base-100/10 flex max-w-xl flex-col gap-10 text-lg text-pretty text-shadow-sm">
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
