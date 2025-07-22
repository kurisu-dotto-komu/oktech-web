import PersonRoleBadge from "./PersonRoleBadge";
import { type Role } from "@/data";

interface PersonRoleBadgesProps {
  roles: Role[];
  compact?: boolean;
}

export default function PersonRoleBadges({ roles, compact = false }: PersonRoleBadgesProps) {
  if (roles.length === 0) return null;

  const sortedRoles = roles.sort((a: Role, b: Role) => a.localeCompare(b));

  return (
    <>
      {sortedRoles.map((role: Role) => (
        <PersonRoleBadge key={role} role={role} compact={compact} />
      ))}
    </>
  );
}
