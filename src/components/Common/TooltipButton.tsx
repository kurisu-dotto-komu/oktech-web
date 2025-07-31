import type { ButtonHTMLAttributes, ReactNode } from "react";

interface TooltipButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: string;
  children: ReactNode;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

export default function TooltipButton({
  tooltip,
  children,
  tooltipPosition = "top",
  className = "",
  ...props
}: TooltipButtonProps) {
  const tooltipClass = tooltipPosition === "top" ? "tooltip-top" : `tooltip-${tooltipPosition}`;

  return (
    <div className={`tooltip ${tooltipClass}`} data-tip={tooltip}>
      <button className={className} {...props}>
        {children}
      </button>
    </div>
  );
}
