import AsanohaShader from "@/components/Common/AsanohaShader";
import Brand from "@/components/Common/Brand";
import Button from "@/components/Common/Button";

export default function HeroSlideLanding() {
  return (
    <div className="relative h-full w-full">
      {/* Shader background */}
      <AsanohaShader className="absolute inset-0" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col gap-16">
          <Brand big />
          <div className="flex flex-col gap-8 text-center text-2xl">
            <div>Welcome to</div>
            <h2 className="text-4xl">Osaka Kyoto Technology Meetup Group</h2>
            <div>Come and join us at our next event!</div>
            <Button href="/about" className="btn-secondary btn-lg" text="Join Us" />
          </div>
        </div>
      </div>
    </div>
  );
}
