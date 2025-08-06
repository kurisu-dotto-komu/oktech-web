import { FaDiscord } from "react-icons/fa6";
import { LuCalendar, LuFileText } from "react-icons/lu";

import BlobCard from "@/components/Common/BlobCard";
import ICSTooltip from "@/components/Common/ICSTooltip";
import Link from "@/components/Common/LinkReact";

export default function GetInvolved() {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
      {/* Join Discord CTA */}
      <div className="flex justify-center">
        <BlobCard preset={0} className="h-56 w-56">
          <Link
            href="/discord"
            className="flex h-full flex-col items-center justify-center p-6 text-center transition-transform hover:scale-105"
            data-testid="discord-cta"
          >
            <FaDiscord className="mb-3 text-5xl" />
            <h3 className="mb-1 text-lg font-bold">Join the Discord</h3>
            <p className="text-xs opacity-80">Chat with our community</p>
          </Link>
        </BlobCard>
      </div>

      {/* Subscribe to Calendar CTA */}
      <div className="flex justify-center">
        <BlobCard preset={1} className="h-56 w-56">
          <ICSTooltip className="h-full w-full">
            <div
              className="flex h-full cursor-pointer flex-col items-center justify-center p-6 text-center transition-transform hover:scale-105"
              data-testid="calendar-cta"
            >
              <LuCalendar className="mb-3 text-5xl" />
              <h3 className="mb-1 text-lg font-bold">Subscribe to Calendar</h3>
              <p className="text-xs opacity-80">Never miss an event</p>
            </div>
          </ICSTooltip>
        </BlobCard>
      </div>

      {/* Submit a Proposal CTA */}
      <div className="flex justify-center">
        <BlobCard preset={2} className="h-56 w-56">
          <a
            href="https://github.com/owddm/owddm.com/discussions/new?category=events"
            className="flex h-full flex-col items-center justify-center p-6 text-center transition-transform hover:scale-105"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="proposal-cta"
          >
            <LuFileText className="mb-3 text-5xl" />
            <h3 className="mb-1 text-lg font-bold">Submit a Proposal</h3>
            <p className="text-xs opacity-80">Share your ideas</p>
          </a>
        </BlobCard>
      </div>
    </div>
  );
}
