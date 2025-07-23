import { LuLayoutGrid } from "react-icons/lu";

interface Stat {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="stats bg-base-100 stats-vertical md:stats-horizontal shadow-lg w-full">
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
