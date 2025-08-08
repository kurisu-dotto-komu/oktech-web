import React from "react";

import { twMerge, twStyle } from "@/utils/og/tw";

interface OGLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function OGLayout({ children, title, subtitle }: OGLayoutProps) {
  return (
    <div
      style={twMerge("h-full w-full flex flex-col bg-gradient-to-br from-primary to-secondary", {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #570df8 0%, #f000b8 100%)",
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      })}
    >
      {/* Main container */}
      <div style={twStyle("flex flex-col flex-1 p-[60px]")}>
        {/* Header */}
        <div style={twStyle("flex justify-start items-center mb-10")}>
          <span style={twStyle("text-[32px] font-bold text-primary-content tracking-tight")}>
            OKTech
          </span>
        </div>

        {/* Content area */}
        <div style={twStyle("flex-1 flex flex-col justify-center max-w-[1000px]")}>
          {/* Title if provided */}
          {title && (
            <h1
              style={twMerge(
                `font-bold text-primary-content leading-tight tracking-tight ${
                  title.length > 50 ? "text-[56px]" : "text-[72px]"
                } ${subtitle ? "mb-4" : "mb-8"}`,
                {
                  color: "#ffffff",
                },
              )}
            >
              {title}
            </h1>
          )}

          {/* Subtitle if provided */}
          {subtitle && (
            <p style={twStyle("text-[28px] text-white/95 leading-tight mb-8 font-medium")}>
              {subtitle}
            </p>
          )}

          {/* Children content */}
          <div style={twStyle("flex flex-col")}>{children}</div>
        </div>

        {/* Bottom branding */}
        <div style={twStyle("flex justify-between items-center mt-10")}>
          <div style={twStyle("flex items-center gap-3")}>
            <div style={twStyle("w-1 h-8 bg-accent rounded-sm")} />
            <div style={twStyle("flex flex-col")}>
              <span style={twStyle("text-primary-content text-xl font-semibold")}>
                Osaka Kansai Tech Community
              </span>
              <span style={twStyle("text-white/70 text-sm")}>Connect • Learn • Build • Grow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Common icon components for reuse
export const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <g>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </g>
  </svg>
);

export const LocationIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <g>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </g>
  </svg>
);

export const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={twStyle("flex items-center gap-3")}>{children}</div>
);
