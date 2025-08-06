import ICSTooltip from "@/components/Common/ICSTooltip";

interface ICSTooltipLinkProps {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function ICSTooltipLink({ label }: ICSTooltipLinkProps) {
  return (
    <ICSTooltip className="dropdown-top" linkText={label}>
      <span className="link link-hover">{label}</span>
    </ICSTooltip>
  );
}