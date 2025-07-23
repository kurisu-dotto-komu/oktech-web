import { ROLE_CONFIGS } from "@/constants";
import type { Role } from "@/content";
import { LuStar } from "react-icons/lu";

interface PersonRoleBadgeProps {
  role: Role;
  compact?: boolean;
}

export default function PersonRoleBadge({ role, compact = false }: PersonRoleBadgeProps) {
  const config = ROLE_CONFIGS[role];

  if (!config) {
    throw new Error(`Role ${role} not found`);
  }

  return (
    <div
      className={`badge ${config.color} ${compact ? "join-item w-7 h-7 px-1 tooltip opacity-70 hover:opacity-100 transition-all duration-100" : "badge-lg gap-2"}`}
      data-tip={compact ? role : null}
      data-theme="light"
    >
      <LuStar size={compact ? 16 : 20} />
      {!compact && config.label}
    </div>
  );
}
