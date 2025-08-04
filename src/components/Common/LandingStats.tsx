import StatsGrid from "./StatsGrid";

export default function LandingStats() {
  return (
    <StatsGrid
      data-testid="landing-stats"
      stats={[
        {
          title: "First Event",
          value: "2015",
          icon: "lucide:calendar",
          description: "Started our journey",
        },
        {
          title: "Total Events",
          value: "172",
          icon: "lucide:calendar-days",
          description: "Events and counting",
        },
        {
          title: "Locations",
          value: "12",
          icon: "lucide:map-pin",
          description: "Cities reached",
        },
        {
          title: "Participants",
          value: "2000+",
          icon: "lucide:users-2",
          description: "Community members",
        },
      ]}
    />
  );
}
