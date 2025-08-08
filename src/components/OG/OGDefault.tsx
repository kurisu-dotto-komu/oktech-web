import { twStyle } from "@/utils/og/tw";

import OGLayout from "./OGLayout";

export default function OGDefault() {
  return (
    <OGLayout title="OKTech" subtitle="Osaka Kansai Tech Community">
      <div style={twStyle("flex flex-col gap-5")}>
        <p style={twStyle("text-2xl leading-relaxed text-white/95")}>
          Join our vibrant tech community for meetups, workshops, and events in Osaka and Kansai.
        </p>
        <p style={twStyle("text-xl text-white/85")}>
          Discover upcoming events, connect with fellow developers, and grow your skills.
        </p>
      </div>
    </OGLayout>
  );
}
