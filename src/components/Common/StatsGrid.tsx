import { LuLayoutGrid } from "react-icons/lu";

interface Stat {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
}

interface StatsGridProps {
  stats: Stat[];
  "data-testid"?: string;
}

export default function StatsGrid({ stats, "data-testid": dataTestId }: StatsGridProps) {
  return (
    <div
      className="stats bg-base-100 stats-vertical md:stats-horizontal w-full shadow-lg"
      data-testid={dataTestId || "stats-grid"}
    >
      {stats.map((stat: Stat) => (
        <div key={stat.title} className="stat">
          <div className="stat-figure text-primary">
            <LuLayoutGrid size={24} />
          </div>
          <div className="stat-title">{stat.title}</div>
          <div className="stat-value">{stat.value}</div>
          {stat.description && <div className="stat-desc">{stat.description}</div>}
        </div>
      ))}
    </div>
  );
}
