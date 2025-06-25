import { SITE } from "../../config";

interface OGLayoutProps {
  children: React.ReactNode;
  gradient?: string;
  bottomLeft?: React.ReactNode;
}

export default function OGLayout({
  children,
  gradient = "linear-gradient(135deg, #1a1c2e 0%, #2d1b69 100%)",
  bottomLeft,
}: OGLayoutProps) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        background: gradient,
        position: "relative",
        fontFamily: "Inter, Noto Sans JP, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "48px",
          position: "relative",
        }}
      >
        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{children}</div>

        {/* Bottom section with optional left content and branding */}
        <div
          style={{
            display: "flex",
            justifyContent: bottomLeft ? "space-between" : "flex-end",
            alignItems: "flex-end",
            marginTop: "32px",
          }}
        >
          {bottomLeft ? bottomLeft : null}

          {/* Site branding */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "white",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "24px", fontWeight: "bold", color: "#1a1c2e" }}>
                {SITE.shortName.charAt(0)}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "white", fontSize: "20px", fontWeight: 600 }}>
                {SITE.shortName}
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
                {SITE.longName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Common icon components for reuse
export const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <g>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </g>
  </svg>
);

export const LocationIcon = ({ size = 20, fill = false }: { size?: number; fill?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill ? "white" : "none"}
    stroke={fill ? "none" : "white"}
    strokeWidth={fill ? 0 : 2}
  >
    <g>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </g>
  </svg>
);

export const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: "40px",
      height: "40px",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);
