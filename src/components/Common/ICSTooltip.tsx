import { useEffect, useRef, useState } from "react";

import CopyText from "@/components/Common/CopyText";
import { resolveBaseUrl } from "@/utils/urlResolver";

interface ICSTooltipProps {
  children?: React.ReactNode;
  className?: string;
  linkText?: string;
}

interface SubsectionProps {
  title: string;
  children: React.ReactNode;
}

function Subsection({ title, children }: SubsectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-base-content/70 px-2 text-xs font-semibold">{title}</div>
      <div className="flex flex-col gap-2 sm:flex-row">{children}</div>
    </div>
  );
}

export default function ICSTooltip({ children, className = "", linkText }: ICSTooltipProps) {
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const baseUrl = resolveBaseUrl();
  const icsUrl = `${baseUrl}/oktech-events.ics`;

  useEffect(() => {
    setHydrated(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.open &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dropdownRef.current.open = false;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Before hydration, render a simple link
  if (!hydrated && linkText) {
    return (
      <a
        href="/oktech-events.ics"
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-testid="ics-tooltip-trigger"
      >
        {linkText}
      </a>
    );
  }

  return (
    <details className={`dropdown dropdown-top ${className}`} ref={dropdownRef}>
      <summary className="cursor-pointer list-none" data-testid="ics-tooltip-trigger">
        {children}
      </summary>
      <div className="dropdown-content bg-base-100 text-base-content rounded-box z-50 mb-2 flex min-w-max flex-col gap-6 p-6 shadow">
        <Subsection title="Calendar Subscription URL">
          <CopyText text={icsUrl} className="w-full" />
        </Subsection>
      </div>
    </details>
  );
}
