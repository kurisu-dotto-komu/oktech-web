import type { Meta, StoryObj } from "@storybook/react";
import EventFeatured from "@/components/Event/EventFeatured";
import type { EventEnriched } from "@/content";

const meta = {
  title: "Event/EventFeatured",
  component: EventFeatured,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof EventFeatured>;

export default meta;
type Story = StoryObj<typeof meta>;

// Real event data from Agentic Sentiments
const agenticSentimentsEvent: EventEnriched = {
  id: "308580120-agentic-sentiments",
  collection: "events",
  data: {
    title: "Agentic Sentiments",
    dateTime: new Date("2025-07-19T17:00:00+09:00"),
    duration: 120,
    topics: ["Data Science using Python", "Python", "Web Design", "Web Development"],
    devOnly: false,
    cover: {
      src: "/events/308580120-agentic-sentiments/651843.webp",
      width: 800,
      height: 450,
      format: "webp",
    },
  },
  venue: {
    id: "24529555-cybozu-osaka-office",
    title: "Cybozu Osaka Office",
    city: "osaka",
    country: "Japan",
    address: "〒530-0017 大阪府大阪市北区角田町8番1号 梅田阪急ビルオフィスタワー 35階",
    lat: 34.70231,
    lng: 135.49876,
    mapImageSrc: "/venues/24529555-cybozu-osaka-office/map.jpg",
  },
  venueSlug: "24529555-cybozu-osaka-office",
};

export const Default: Story = {
  args: {
    event: agenticSentimentsEvent,
  },
};

export const DefaultWithoutMap: Story = {
  args: {
    event: agenticSentimentsEvent,
    hideMap: true,
  },
};
